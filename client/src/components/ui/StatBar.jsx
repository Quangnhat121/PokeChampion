import { useEffect, useRef, useState } from 'react'
import { getStatColor, getStatLabel } from '../../utils/typeData'

export default function StatBar({ label, value, maxValue = 255 }) {
  const [animated, setAnimated] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const percentage = Math.min((value / maxValue) * 100, 100)
  const color = getStatColor(value)
  const statLabel = getStatLabel(value)

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider w-12">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {statLabel}
          </span>
          <span
            className="text-sm font-bold tabular-nums w-8 text-right"
            style={{ color }}
          >
            {value}
          </span>
        </div>
      </div>
      <div className="w-full bg-[#12121a] rounded-full h-2 overflow-hidden">
        <div
          ref={barRef}
          className="stat-bar h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${percentage}%` : '0%',
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}
