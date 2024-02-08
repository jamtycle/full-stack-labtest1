import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { regiterUser } from "../api/api";

const Register = () => {
    const nav = useNavigate();

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        regiterUser({
            username,
            firstname: firstName,
            lastname: lastName,
            password,
        })
            .then((res) => {
                console.log(res.data);
                nav("/");
            })
            .catch((ex) => console.error(ex));
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                className="shadow-md p-8 border-2 border-slate-600 rounded-2xl gap-4 flex flex-col"
                onSubmit={handleSubmit}
            >
                <h1 className="text-4xl text-center">Register</h1>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Username</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={username}
                        onChange={(x) => setUsername(x.target.value)}
                    />
                </label>

                <div className="flex gap-4">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">First Name</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            value={firstName}
                            onChange={(x) => setFirstName(x.target.value)}
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Last Name</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            value={lastName}
                            onChange={(x) => setLastName(x.target.value)}
                        />
                    </label>
                </div>

                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">Password</span>
                    </div>
                    <input
                        type="password"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(x) => setPassword(x.target.value)}
                    />
                </label>

                <div className="flex items-center justify-center gap-5 mt-5">
                    <NavLink
                        to="/"
                        className="btn btn-warning w-1/2"
                        type="submit"
                    >
                        Back to Login
                    </NavLink>
                    <button className="btn btn-primary w-1/2" type="submit">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
