// src/services/savings.service.js
import api from "../hooks/useApi";

export const getMyEnvelopes = () => api.get("/savings");
export const getEnvelope = (id) => api.get(`/savings/${id}`);
export const createEnvelope = (payload) => api.post("/savings", payload);
export const deposit = (payload) => api.post("/savings/deposit", payload);
export const withdraw = (payload) => api.post("/savings/withdraw", payload);
export const deleteEnvelope = (id) => api.delete(`/savings/${id}`);
export const getMovements = (id) => api.get(`/savings/${id}/movements`);
export const updateEnvelope = (id, payload) =>
  api.put(`/savings/${id}`, payload);
