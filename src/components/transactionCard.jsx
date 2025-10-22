import React from 'react'
import { MODE } from '../constants/routes'

export default function TransactionCard({ transaction }) {
  return (
    <div className="border p-2 mb-2">
      <div><strong>From:</strong> {transaction.senderId}  <strong>To:</strong> {transaction.receiverId}</div>
      <div><strong>Amount:</strong> {transaction.amount}</div>
      <div>
        <strong>Description:</strong>
        {MODE === 'vulnerable' ? (
          // VULNERABLE: deliberately render raw HTML -> stored XSS demo
          <div dangerouslySetInnerHTML={{ __html: transaction.description }} />
        ) : (
          <div>{transaction.description}</div>
        )}
      </div>
    </div>
  )
}
