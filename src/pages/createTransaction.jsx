import React, { useState } from 'react'
import * as txService from '../services/transaction.service'

export default function CreateTransaction() {
  const [senderId, setSenderId] = useState('')
  const [receiverId, setReceiverId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('<b>test</b>') // allow html
  const [msg, setMsg] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    try {
      // VULNERABLE: senderId editable, description allows html/script
      await txService.create({ senderId, receiverId, amount, description })
      setMsg('created')
    } catch (err) {
      setMsg('error: ' + String(err?.response?.data || err))
    }
  }

  return (
    <div className="p-4 max-w-lg">
      <h2>Create Transaction (vulnerable)</h2>
      <form onSubmit={onSubmit} className="space-y-2">
        <input value={senderId} onChange={e=>setSenderId(e.target.value)} placeholder="senderId (editable)" className="w-full p-2 border"/>
        <input value={receiverId} onChange={e=>setReceiverId(e.target.value)} placeholder="receiverId" className="w-full p-2 border"/>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="amount" className="w-full p-2 border"/>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="description (HTML allowed)" className="w-full p-2 border h-24"/>
        <button className="px-4 py-2 bg-green-600 text-white">Create</button>
      </form>
      {msg && <div className="mt-2">{msg}</div>}
    </div>
  )
}
