import React, { createContext, useState, useEffect } from 'react'
import * as authService from '../services/auth.service'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('picobanco_user') || 'null')
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('picobanco_token'))

  useEffect(() => {
    // persist token + user (VULNERABLE: using localStorage)
    if (token) localStorage.setItem('picobanco_token', token)
    else localStorage.removeItem('picobanco_token')

    if (user) localStorage.setItem('picobanco_user', JSON.stringify(user))
    else localStorage.removeItem('picobanco_user')
  }, [token, user])

  async function login(credentials) {
    const res = await authService.login(credentials)
    if (res?.data) {
      const { accessToken, user: u } = res.data
      // VULNERABLE: store token and full user including password
      setToken(accessToken)
      setUser(u)
      console.log('login: server returned user.password ->', u?.password) // VULNERABLE: expose password in console for demo
    }
    return res
  }

  function logout() {
    setToken(null)
    setUser(null)
    // optionally call logout endpoint
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
