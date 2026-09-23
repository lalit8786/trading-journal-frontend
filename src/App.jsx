import { useState, useEffect } from 'react'

function App() {
  const [trades, setTrades] = useState([])
  const [stats, setStats] = useState(null)
  const [openTime, setOpenTime] = useState('')
  const [profit, setProfit] = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)
  const [openMenuRow, setOpenMenuRow] = useState(null)
  useEffect(() => {
    fetch('http://127.0.0.1:8000/trades')
      .then(response => response.json())
      .then(data => {
        setTrades(data)
      })
  }, [])
  useEffect(() => {
    fetch('http://127.0.0.1:8000/stats')
      .then(response => response.json())
      .then(data => {
        setStats(data)
      })
  }, [])
  function handleSubmit(e) {
  e.preventDefault()
  fetch('http://127.0.0.1:8000/trades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ open_time: openTime, profit: parseFloat(profit) })
  })
        .then(() => {
      fetch('http://127.0.0.1:8000/trades')
        .then(response => response.json())
        .then(data => setTrades(data))

      fetch('http://127.0.0.1:8000/stats')
        .then(response => response.json())
        .then(data => setStats(data))
      setOpenTime('')
      setProfit('')
    })
  }
  function handleDelete(rowid) {
  fetch(`http://127.0.0.1:8000/trades?rowid=${rowid}`, {
    method: 'DELETE'
  })
    .then(() => {
      fetch('http://127.0.0.1:8000/trades')
        .then(response => response.json())
        .then(data => setTrades(data))

      fetch('http://127.0.0.1:8000/stats')
        .then(response => response.json())
        .then(data => setStats(data))
      setOpenMenuRow(null)
    })
}
  return (
    <div>
      <h1>Trading Journal</h1>
      {stats && (
  <div>
    <p>Win Rate: {stats.win_rate}%</p>
    <p>Profit Factor: {stats.profit_factor}</p>
    <p>Expectancy: {stats.expectancy}</p>
    <p>Drawdown: {stats.drawdown}</p>
  </div>
)}
    <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Open time (YYYY-MM-DD HH:MM:SS)"
    value={openTime}
    onChange={e => setOpenTime(e.target.value)}
  />
  <input
    type="number"
    placeholder="Profit"
    value={profit}
    onChange={e => setProfit(e.target.value)}
  />
  <button type="submit">Log Trade</button>
</form> 
      <table>
        <thead>
          <tr>
            <th>Open Time</th>
            <th>Profit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade,index) => (
            <tr
              key={trade.rowid}
              onMouseEnter={() => setHoveredRow(trade.rowid)}
              onMouseLeave={() => {
              setHoveredRow(null)
              setOpenMenuRow(null)
              }}
            >
              <td>{trade.open_time}</td>
              <td>{trade.profit}</td>
              <td>
              {hoveredRow === trade.rowid && (
                <button onClick={() => setOpenMenuRow(trade.rowid)}>⋮</button>
              )}
              {openMenuRow === trade.rowid && (
                <div>
                  <button onClick={() => handleDelete(trade.rowid)}>Delete</button>
                </div>
              )}
              </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App