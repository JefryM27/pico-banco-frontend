import api from "../hooks/useApi";

export const getAll = () => api.get("/transactions");
export const getByUser = (userId) => api.get(`/transactions/user/${userId}`);
export const create = (payload) => api.post("/transactions", payload);
export const getMyStats = () => api.get("/transactions/me/stats");
export const getMyBalance = () => api.get("/transactions/me/balance");
