import React, { useEffect, useState } from 'react'
import * as txService from '../services/transaction.service'
import TransactionCard from '../components/transactionCard'

export default function Transactions() {
  const [txs, setTxs] = useState([])

  useEffect(() => {
    txService.getAll().then(r => setTxs(r.data || [])).catch(console.error)
  }, [])

  return (
    <div className="p-4">
      <h2>All Transactions (vulnerable)</h2>
      <div>{txs.map(t => <TransactionCard key={t.id} transaction={t} />)}</div>
    </div>
  )
}
