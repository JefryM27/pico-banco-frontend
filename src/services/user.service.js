import api from '../hooks/useApi'

export const getAllUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const register = (payload) => api.post('/users/register', payload)
