import React, { useEffect, useState } from 'react'
import * as txService from '../services/transaction.service'
import TransactionCard from '../components/transactionCard'
export default function UserTransactions() {
  const [userId, setUserId] = useState('')
  const [txs, setTxs] = useState([])
  const [err, setErr] = useState(null)

  async function load(id) {
    try {
      const res = await txService.getByUser(id)
      setTxs(res.data || [])
    } catch (e) {
      setErr(e?.response?.data || String(e))
    }
  }

  useEffect(() => {}, [])

  return (
    <div className="p-4">
      <h2>Transactions by User (vulnerable)</h2>
      <div className="mb-2">
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="userId (try other ids)" className="p-2 border mr-2"/>
        <button onClick={() => load(userId)} className="px-3 py-1 bg-gray-700 text-white">Load</button>
      </div>
      {err && <pre className="text-red-600">{JSON.stringify(err)}</pre>}
      <div>
        {txs.map(t => <TransactionCard key={t.id} transaction={t} />)}
      </div>
    </div>
  )
}
