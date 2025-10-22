import React, { useEffect, useState } from 'react'
import * as userService from '../services/user.service'

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [err, setErr] = useState(null)
  const [query, setQuery] = useState('')

  async function load(q) {
    try {
      // VULNERABLE: no input sanitation; we pass query raw to backend as query param
      const res = await userService.getAllUsers({ params: { q } })
      setUsers(res.data || [])
    } catch (e) {
      setErr(e?.response?.data || String(e))
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Users (vulnerable list)</h2>
      <div className="mb-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="search (try SQLi payloads)" className="p-2 border mr-2"/>
        <button onClick={() => load(query)} className="px-3 py-1 bg-gray-700 text-white">Search</button>
      </div>
      {err && <pre className="text-red-600">{JSON.stringify(err)}</pre>}
      <table className="w-full table-auto border">
        <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Password (plain!)</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.password}</td> {/* VULNERABLE: passwords shown */}
              <td>
                <button onClick={() => window.fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${u.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('picobanco_token')}` } }).then(()=>location.reload())} className="px-2 py-1 bg-red-600 text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
