import api from '../hooks/useApi'

export const login = (credentials) => api.post('/auth/login', credentials)
export const refresh = (payload) => api.post('/auth/refresh', payload)
export const logout = () => api.post('/auth/logout')
