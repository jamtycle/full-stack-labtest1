import React, { createRef, useEffect, useState } from "react";
import { socket } from "../api/socket";
import { fetchDirectMessages, fetchGroupMessages } from "../api/api";
import { useNavigate } from "react-router-dom";

let user_id = "";
let username = "";

const ConnectionStatus = {
    DISCONNECTED: 0,
    CONNECTED: 1,
    ERROR: 2,
};

const ChatType = {
    GROUP: "group",
    DIRECT: "direct",
};

const MainPage = () => {
    const nav = useNavigate();
    const [chatStatus, setChatStatus] = useState(ConnectionStatus.DISCONNECTED);
    const [chatType, setChatType] = useState(ChatType.GROUP);

    const [receiverLoading, setReceiverLoading] = useState(false);
    const [chatReceiver, setChatReceiver] = useState("");

    const [validChat, setValidChat] = useState(false);

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [typingMessage, setTypingMessage] = useState("");

    const chatBottom = createRef();

    const loadMessages = () => {
        setValidChat(chatReceiver);
        if (!chatReceiver) {
            setChatMessages([]);
            setValidChat(false);
            setReceiverLoading(false);
            return;
        }

        switch (chatType) {
            case ChatType.GROUP:
                if (chatReceiver.length < 3) {
                    setChatMessages([]);
                    setValidChat(false);
                    setReceiverLoading(false);
                    return;
                }

                fetchGroupMessages(chatReceiver)
                    .then((res) => {
                        console.log(res);
                        setChatMessages(res.data);
                        setValidChat(true);
                        setReceiverLoading(false);
                    })
                    .catch((ex) => {
                        console.error(ex);
                    });
                break;

            case ChatType.DIRECT:
                if (chatReceiver.length < 5) {
                    setChatMessages([]);
                    setValidChat(false);
                    setReceiverLoading(false);
                    return;
                }

                fetchDirectMessages(username, chatReceiver)
                    .then((res) => {
                        console.log(res);
                        setChatMessages(res.data);
                        setValidChat(true);
                        setReceiverLoading(false);
                    })
                    .catch((ex) => {
                        console.error(ex);
                    });
                break;
        }
    };

    const fastLoadMessages = () => {
        switch (chatType) {
            case ChatType.GROUP:
                fetchGroupMessages(chatReceiver)
                    .then((res) => {
                        console.log(res);
                        setChatMessages(res.data);
                    })
                    .catch((ex) => {
                        console.error(ex);
                    });
                break;

            case ChatType.DIRECT:
                fetchDirectMessages(username, chatReceiver)
                    .then((res) => {
                        console.log(res);
                        setChatMessages(res.data);
                    })
                    .catch((ex) => {
                        console.error(ex);
                    });
                break;
        }
    };

    const sendMessage = () => {
        socket.send({
            user_id,
            username,
            message,
            type: chatType,
            receiver: chatReceiver,
            action: "create",
        });
        setMessage("");
    };

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            nav("/");
            return;
        }
        const user = JSON.parse(localStorage.getItem("user"));
        user_id = user._id;
        username = user.username;

        const onConnect = () => {
            setChatStatus(ConnectionStatus.CONNECTED);
        };

        const onDisconnect = () => {
            setChatStatus(ConnectionStatus.DISCONNECTED);
        };

        socket.on("connect", onConnect).emit("client_ack", user_id);
        socket.on("disconnect", onDisconnect);
        socket.on("message", (msg) => {
            console.log(msg);
            fastLoadMessages();
        });
        socket.on("typing", (username) => {
            setTypingMessage(`${username} is typing...`);
        });

        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("message", loadMessages);
        };
    }, []);

    useEffect(() => {
        const info = message.length > 0;
        socket.emit("typing", user_id, info);

        const toutid = setTimeout(() => {
            socket.emit("typing", user_id, false);
        }, 5000);
        return () => clearInterval(toutid);
    }, [message]);

    useEffect(() => {
        if (!chatBottom.current) return;
        chatBottom.current.scrollIntoView({ behavior: "smooth" });
    }, [chatBottom]);

    useEffect(() => {
        setReceiverLoading(true);
        const tmid = setTimeout(loadMessages, 2000);
        return () => clearTimeout(tmid);
    }, [chatReceiver]);

    useEffect(() => {
        loadMessages();
    }, [chatType]);

    return (
        <div className="text-center flex flex-col gap-5 items-center justify-center align-middle w-5/12 border-2 border-slate-600 rounded-2xl p-4 shadow-xl relative">
            <div className="w-full flex justify-between items-center align-middle">
                <div className="w-fit flex gap-2">
                    <div>
                        <button
                            className="btn btn-warning btn-sm btn-circle"
                            onClick={() => {
                                localStorage.removeItem("user");
                                nav("/");
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                />
                            </svg>
                        </button>
                    </div>
                    {chatStatus === ConnectionStatus.CONNECTED ? (
                        <div className="flex items-center justify-center align-middle gap-2">
                            <div className="bg-green-500 h-5 w-5 rounded-full inline-block" />
                            <span className="text-green-500 font-semibold">
                                Connected
                            </span>
                        </div>
                    ) : chatStatus === ConnectionStatus.DISCONNECTED ? (
                        <div className="flex items-center justify-center align-middle gap-2">
                            <div className="bg-gray-500 h-5 w-5 rounded-full inline-block" />
                            <span className="text-gray-500 font-semibold">
                                Disconnected
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center align-middle gap-2">
                            <div className="bg-red-500 h-5 w-5 rounded-full inline-block" />
                            <span className="text-red-500 font-semibold">
                                Error
                            </span>
                        </div>
                    )}
                </div>
                <div>{username}</div>
                <div className="flex flex-row-reverse gap-3">
                    <div className="join">
                        <input
                            className="join-item btn"
                            type="radio"
                            name="chat-type"
                            aria-label="Group"
                            onChange={() => {
                                setChatType(ChatType.GROUP);
                                setChatReceiver("");
                            }}
                            checked={chatType === ChatType.GROUP}
                        />
                        <input
                            className="join-item btn"
                            type="radio"
                            name="chat-type"
                            aria-label="Direct"
                            onChange={() => {
                                setChatType(ChatType.DIRECT);
                                setChatReceiver("");
                            }}
                            checked={chatType === ChatType.DIRECT}
                        />
                    </div>

                    <div className="flex items-center justify-end align-middle gap-2">
                        <label className="relative w-1/2">
                            <input
                                className="input input-bordered input-sm w-full pr-10 text-left font-semibold placeholder:text-base-200 placeholder:opacity-40"
                                type="text"
                                value={chatReceiver}
                                onChange={(x) =>
                                    setChatReceiver(x.target.value)
                                }
                            />
                            {receiverLoading === true && (
                                <span className="loading loading-spinner loading-sm pointer-events-none absolute left-[83%] top-[50%] z-40 h-5 -translate-y-1/2 transform"></span>
                            )}
                        </label>
                        {chatType === ChatType.GROUP ? (
                            <span className="font-semibold">Room Name</span>
                        ) : (
                            <span className="font-semibold">Username</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-80 w-full border-2 border-slate-500 rounded-2xl text-left p-4 overflow-y-auto">
                {chatMessages && chatMessages.length === 0 && (
                    <div className="text-center text-gray-500">
                        No Messages to show!
                    </div>
                )}
                {chatMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat ${msg.from_user === username ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-header">
                            {msg.from_user}
                            <time className="text-xs opacity-50 mx-1">
                                {new Date(msg.date_sent).toLocaleDateString()}
                            </time>
                        </div>
                        <div
                            className={`chat-bubble ${msg.from_user === username ? "chat-bubble-secondary" : "chat-bubble-primary"}`}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div className="float-left clear-both" ref={chatBottom} />
            </div>

            {typingMessage && (
                <div className="text-xs text-left pointer-events-none absolute left-[4%] top-[78%] z-40 h-5 -translate-y-1/2 transform">
                    {typingMessage}
                </div>
            )}

            <div className="flex items-center justify-center align-middle gap-3 w-full">
                <input
                    className="input input-primary w-full"
                    value={message}
                    onChange={(x) => setMessage(x.target.value)}
                    onKeyDown={(e) => {
                        e.key === "Enter" && sendMessage();
                    }}
                />
                <button
                    className={`btn w-fit ${validChat ? "btn-primary" : "btn-disabled"}`}
                    onClick={sendMessage}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MainPage;
