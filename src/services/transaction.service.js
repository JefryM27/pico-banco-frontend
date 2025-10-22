import api from '../hooks/useApi'

export const getAll = () => api.get('/transactions')
export const getByUser = (userId) => api.get(`/transactions/user/${userId}`)
export const create = (payload) => api.post('/transactions', payload)
