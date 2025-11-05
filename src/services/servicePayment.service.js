// src/services/servicePayment.service.js
import api from "../hooks/useApi";

export const createPayment = (payload) =>
  api.post("/service-payments", payload);
export const getMyPayments = () => api.get("/service-payments");
export const getPayment = (id) => api.get(`/service-payments/${id}`);
