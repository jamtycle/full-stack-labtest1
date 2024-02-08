import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

/**
 *
 * @param {string} _room_name
 * @returns {import("axios").AxiosPromise}
 */
export const fetchGroupMessages = (_room_name) => {
    return client.get("/api/gm", { params: { room: _room_name } });
};

/**
 *
 * @param {string} _room_name
 * @returns {import("axios").AxiosPromise}
 */
export const fetchDirectMessages = (_from, _to) => {
    return client.get("/api/dm", {
        params: { from_user: _from, to_user: _to },
    });
};

/**
 *
 * @param {{ username: string, firstname: string, lastname: string, password: string }} user
 * @returns {import("axios").AxiosPromise}
 */
export const regiterUser = (user) => {
    return client.post("/api/user/signup", user);
};

/**
 *
 * @param {{ username: string, password: string }} user
 * @returns {import("axios").AxiosPromise}
 */
export const loginUser = (user) => {
    return client.post("/api/user/login", user);
};
