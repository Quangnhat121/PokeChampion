import { Grid3x3 } from 'lucide-react'
import { TYPE_LIST, TYPE_COLORS, TYPE_EFFECTIVENESS } from '../utils/typeData'

function getEffectiveness(attackType, defenseType) {
  const atk = TYPE_EFFECTIVENESS[attackType.toLowerCase()]
  if (!atk) return 1
  const def = defenseType.toLowerCase()
  if (atk.noEffect?.includes(def)) return 0
  if (atk.superEffective?.includes(def)) return 2
  if (atk.notVeryEffective?.includes(def)) return 0.5
  return 1
}

function getCellStyle(value) {
  if (value === 0) return 'bg-gray-900 text-gray-600'
  if (value === 0.5) return 'bg-red-900/40 text-red-400'
  if (value === 2) return 'bg-green-900/40 text-green-400'
  return 'text-gray-600'
}

export default function TypeChart() {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Grid3x3 className="w-8 h-8 text-emerald-400" /> Type Chart
        </h1>
        <p className="text-gray-400 mt-1">Pokémon type effectiveness matchup table</p>
      </div>

      {/* Legend */}
      <div className="glass-card p-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded bg-green-900/40 flex items-center justify-center text-green-400 text-xs font-bold">2×</div>
          <span className="text-gray-300">Super Effective</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded bg-red-900/40 flex items-center justify-center text-red-400 text-xs font-bold">½</div>
          <span className="text-gray-300">Not Very Effective</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded bg-gray-900 flex items-center justify-center text-gray-600 text-xs font-bold">0</div>
          <span className="text-gray-300">No Effect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 rounded bg-transparent flex items-center justify-center text-gray-600 text-xs font-bold">1×</div>
          <span className="text-gray-300">Normal</span>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card overflow-x-auto">
        <div className="min-w-[900px]">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-gray-400 text-left sticky left-0 bg-[#1a1a2e] z-10 min-w-[80px]">
                  <div className="text-[10px]">ATK →<br/>DEF ↓</div>
                </th>
                {TYPE_LIST.map((t) => (
                  <th key={t} className="p-1 text-center">
                    <div
                      className="px-1.5 py-1 rounded text-[10px] font-bold text-white uppercase leading-tight"
                      style={{ backgroundColor: TYPE_COLORS[t] }}
                    >
                      {capitalize(t).slice(0, 3)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPE_LIST.map((defType) => (
                <tr key={defType} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-2 sticky left-0 bg-[#1a1a2e] z-10 group-hover:bg-[#1e1e35]">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: TYPE_COLORS[defType] }}
                      />
                      <span className="text-gray-300 font-medium text-[11px]">{capitalize(defType)}</span>
                    </div>
                  </td>
                  {TYPE_LIST.map((atkType) => {
                    const eff = getEffectiveness(atkType, defType)
                    return (
                      <td key={atkType} className={`p-1 text-center ${getCellStyle(eff)}`}>
                        <div className="w-8 h-6 mx-auto flex items-center justify-center rounded text-[11px] font-bold">
                          {eff === 1 ? '' : eff === 0.5 ? '½' : eff === 0 ? '0' : '2'}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Type Details Cards */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Type Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TYPE_LIST.map((type) => {
            const data = TYPE_EFFECTIVENESS[type.toLowerCase()]
            return (
              <div key={type} className="glass-card p-4 hover:border-[#3a3a5a] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase" style={{ backgroundColor: TYPE_COLORS[type] }}>
                    {capitalize(type)}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {data.superEffective.length > 0 && (
                    <div>
                      <span className="text-green-400 font-medium">Strong against: </span>
                      <span className="text-gray-300">{data.superEffective.map(capitalize).join(', ')}</span>
                    </div>
                  )}
                  {data.notVeryEffective.length > 0 && (
                    <div>
                      <span className="text-red-400 font-medium">Weak against: </span>
                      <span className="text-gray-300">{data.notVeryEffective.map(capitalize).join(', ')}</span>
                    </div>
                  )}
                  {data.noEffect.length > 0 && (
                    <div>
                      <span className="text-gray-500 font-medium">No effect on: </span>
                      <span className="text-gray-300">{data.noEffect.map(capitalize).join(', ')}</span>
                    </div>
                  )}
                  {data.superEffective.length === 0 && data.notVeryEffective.length === 0 && data.noEffect.length === 0 && (
                    <span className="text-gray-500">Neutral against all types</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
