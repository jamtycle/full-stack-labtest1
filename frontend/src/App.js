import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
    return (
        <BrowserRouter>
            <main className="w-screen h-screen flex justify-center items-center align-middle">
                <Routes>
                    <Route index path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/app" element={<MainPage />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;