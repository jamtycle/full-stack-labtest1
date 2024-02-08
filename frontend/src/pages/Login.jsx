import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const Login = () => {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({ username, password })
            .then((res) => {
                console.log(res.data);
                if (res.data.result) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    nav("/app");
                }
            })
            .catch((ex) => console.error(ex));
    };

    return (
        <div className="flex justify-center items-center h-screen w-fit">
            <form
                className="shadow-md p-8 border-2 border-slate-600 rounded-2xl gap-4 flex flex-col"
                onSubmit={handleSubmit}
            >
                <h1 className="text-4xl text-center">Login</h1>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Username</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        value={username}
                        onChange={(x) => setUsername(x.target.value)}
                    />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Password</span>
                    </div>
                    <input
                        type="password"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        value={password}
                        onChange={(x) => setPassword(x.target.value)}
                    />
                </label>

                <div className="flex flex-col gap-2 items-center justify-between">
                    <button className="btn btn-primary btn-block" type="submit">
                        Sign In
                    </button>
                    <NavLink
                        to="/register"
                        className="btn btn-info btn-block"
                        type="submit"
                    >
                        Register
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default Login;
