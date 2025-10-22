import React from 'react'

export default function SecurityDemo() {
  const sqli = "' OR 1=1 -- "
  const xss = '<script>alert("XSS")</script>'

  return (
    <div className="p-4">
      <h2>Security Demo - payloads</h2>
      <div className="mb-4">
        <h3>SQLi example</h3>
        <pre>{sqli}</pre>
        <button onClick={() => navigator.clipboard.writeText(sqli)} className="px-3 py-1 bg-gray-700 text-white">Copy SQLi</button>
      </div>
      <div>
        <h3>XSS example</h3>
        <pre>{xss}</pre>
        <button onClick={() => navigator.clipboard.writeText(xss)} className="px-3 py-1 bg-gray-700 text-white">Copy XSS</button>
      </div>
      <p className="mt-4 text-sm text-gray-600">Use these payloads in login/search/create transaction forms to reproduce the vulnerabilities.</p>
    </div>
  )
}
