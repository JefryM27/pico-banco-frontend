import axios from 'axios'
import { API } from '../constants/routes'

const api = axios.create({ baseURL: API.BASE, withCredentials: false })

// Request interceptor: inject token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('picobanco_token') // VULNERABLE: localStorage token usage
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Response interceptor: show verbose errors (VULNERABLE)
api.interceptors.response.use(
  res => res,
  err => {
    // VULNERABLE: expose entire backend error to UI/console
    console.error('API ERROR', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export default api
