import api from '../hooks/useApi'

export const getMyProfile = () => api.get('/users/me')
export const getMyBalance = () => api.get('/users/me/balance')
export const updateProfile = (data) => api.put('/users/me', data)