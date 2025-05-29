import { useState } from 'react'

const PRIZE_TABLE = [
  { match: 6, bonus: false, prize: 1_000_000 },
  { match: 5, bonus: true, prize: 5000 },
  { match: 5, bonus: false, prize: 500 },
  { match: 4, bonus: true, prize: 50 },
  { match: 4, bonus: false, prize: 20 },
  { match: 3, bonus: true, prize: 10 },
  { match: 3, bonus: false, prize: 3 },
  { match: 2, bonus: true, prize: 2 },
]

function App() {
  const [numbers, setNumbers] = useState(Array(6).fill(''))
  const [bonus, setBonus] = useState('')
  const [losses, setLosses] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [drawn, setDrawn] = useState<number[]>([])
  const [drawnBonus, setDrawnBonus] = useState<number | null>(null)
  const [history, setHistory] = useState<{ nums: number[]; bonus: number }[]>([])

  const handleNumberChange = (i: number, value: string) => {
    const copy = [...numbers]
    copy[i] = value
    setNumbers(copy)
  }

  const playLotto = () => {
    const userNumbers = numbers.map(Number)
    const userBonus = Number(bonus)

    if (userNumbers.includes(NaN) || isNaN(userBonus)) return

    const pool = Array.from({ length: 47 }, (_, i) => i + 1)
    const draw = pool.sort(() => Math.random() - 0.5).slice(0, 7)
    const drawnNumbers = draw.slice(0, 6).sort((a, b) => a - b)
    const drawnBonusNum = draw[6]

    setDrawn(drawnNumbers)
    setDrawnBonus(drawnBonusNum)
    setLosses((prev) => prev + 2)

    const matchCount = userNumbers.filter((n) => drawnNumbers.includes(n)).length
    const bonusMatch = userBonus === drawnBonusNum

    const prize = PRIZE_TABLE.find(
      (entry) => entry.match === matchCount && entry.bonus === bonusMatch
    )?.prize || 0

    setEarnings((prev) => prev + prize)

    const newHistory = [{ nums: drawnNumbers, bonus: drawnBonusNum }, ...history].slice(0, 5)
    setHistory(newHistory)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-black">Irish Lotto 🎰</h1>

      {/* Inputs */}
      <div className="flex flex-wrap justify-center gap-4 mb-2 max-w-full">
        {numbers.map((val, i) => (
          <input
            key={i}
            type="number"
            value={val}
            onChange={(e) => handleNumberChange(i, e.target.value)}
            className="w-16 h-16 text-center text-2xl text-black border rounded-md shadow"
          />
        ))}
        <input
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          className="w-16 h-16 text-center text-2xl text-black border border-yellow-500 rounded-md shadow"
        />
      </div>

      {/* Play button */}
      <button
        onClick={playLotto}
        className="mb-6 mt-2 px-6 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-md shadow"
      >
        Play Lotto
      </button>

      {/* Drawn Results */}
      {drawn.length > 0 && (
        <div className="mb-4 text-center">
          <p className="text-xl font-semibold text-black">Drawn Numbers:</p>
          <div className="flex justify-center flex-wrap gap-2 mt-2">
            {drawn.map((n, i) => (
              <div key={i} className="w-10 h-10 bg-white text-black text-xl font-bold rounded-full border flex items-center justify-center">
                {n}
              </div>
            ))}
            <div className="w-10 h-10 bg-yellow-300 text-black text-xl font-bold rounded-full border flex items-center justify-center">
              {drawnBonus}
            </div>
          </div>
        </div>
      )}

      {/* Losses / Earnings */}
      <div className="flex justify-between gap-10 w-full max-w-xs text-lg font-semibold">
        <div className="text-red-600">Losses: €{losses}</div>
        <div className="text-green-600">Earnings: €{earnings}</div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-2 text-black text-center">History (Last 5 Draws)</h2>
          <ul className="space-y-2 text-center">
            {history.map((entry, i) => (
              <li key={i} className="flex justify-center items-center gap-1 flex-wrap">
                {entry.nums.map((n, j) => (
                  <span
                    key={j}
                    className="w-8 h-8 bg-white text-black text-sm font-medium rounded-full border flex items-center justify-center"
                  >
                    {n}
                  </span>
                ))}
                <span className="w-8 h-8 bg-yellow-300 text-black text-sm font-medium rounded-full border flex items-center justify-center">
                  {entry.bonus}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
