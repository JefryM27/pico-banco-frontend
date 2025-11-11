import api from "../hooks/useApi";

export const getMyProfile = () => api.get("/users/me");
export const getMyBalance = () => api.get("/users/me/balance");
export const updateProfile = (data) => api.put("/users/me", data);
export const getAllUsers = (config) => api.get("/users", config);
export const getUserById = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const createUser = (payload) => api.post("/users", payload);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload);
