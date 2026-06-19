import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, Ruler, Weight, Zap } from 'lucide-react'
import { usePokemonDetail } from '../../hooks/usePokedex'
import { getTypeColor, getTypeVi, formatName, padId, getStatColor, STAT_LABELS } from '../../utils/pokedexUtils'
import PokeTypeBadge from '../../components/pokedex/PokeTypeBadge'
import { useState, useEffect } from 'react'

function StatBar({ label, value }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t) }, [])
  const pct = Math.min((value / 255) * 100, 100)
  const color = getStatColor(value)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-24 text-right shrink-0">{label}</span>
      <span className="text-sm font-bold tabular-nums w-8 text-right shrink-0" style={{ color }}>{value}</span>
      <div className="flex-1 h-2 bg-[#12121a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${pct}%` : '0%', backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  )
}

export default function PokedexPokemonDetail() {
  const { nameOrId } = useParams()
  const { data: pokemon, loading, error } = usePokemonDetail(nameOrId)
  const [activeTab, setActiveTab] = useState('stats')

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Đang tải dữ liệu từ PokeAPI...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 font-medium">{error}</p>
        <Link to="/pokedex/pokemon" className="btn-primary mt-4 inline-flex">← Quay lại</Link>
      </div>
    </div>
  )

  if (!pokemon) return null

  const primaryColor = getTypeColor(pokemon.types[0])
  const totalStats = Object.values(pokemon.stats).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Back */}
      <Link to="/pokedex/pokemon" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Danh sách Pokémon
      </Link>

      {/* Hero Card */}
      <div
        className="relative rounded-3xl overflow-hidden p-8"
        style={{ background: `linear-gradient(135deg, ${primaryColor}20 0%, #1a1a2e 60%)`, border: `1px solid ${primaryColor}30` }}
      >
        {/* Background circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: primaryColor }} />
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-5" style={{ backgroundColor: primaryColor }} />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Image */}
          <div className="shrink-0">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ backgroundColor: primaryColor }} />
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-gray-400 text-sm font-mono mb-1">#{padId(pokemon.id)}</div>
            <h1 className="text-4xl font-black text-white mb-1 capitalize">{formatName(pokemon.name)}</h1>
            {pokemon.genus && <p className="text-gray-400 text-sm mb-3">{pokemon.genus}</p>}

            {/* Types */}
            <div className="flex gap-2 justify-center md:justify-start mb-4">
              {pokemon.types.map((t) => (
                <Link key={t} to={`/pokedex/types/${t}`}>
                  <PokeTypeBadge type={t} showVi size="md" />
                </Link>
              ))}
            </div>

            {/* Flavor */}
            {pokemon.flavorText && (
              <p className="text-gray-300 text-sm leading-relaxed max-w-md italic border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                "{pokemon.flavorText}"
              </p>
            )}

            {/* Basic info */}
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-center"><Ruler className="w-3 h-3" /> Chiều cao</div>
                <div className="text-white font-bold">{pokemon.height}m</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-center"><Weight className="w-3 h-3" /> Cân nặng</div>
                <div className="text-white font-bold">{pokemon.weight}kg</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-center"><Zap className="w-3 h-3" /> Base EXP</div>
                <div className="text-white font-bold">{pokemon.baseExperience || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#2a2a4a]">
        {['stats', 'abilities', 'moves'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 -mb-px border-b-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {{ stats: 'Chỉ số', abilities: 'Đặc tính', moves: 'Chiêu thức' }[tab]}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Chỉ số cơ bản</h2>
            <div className="text-right">
              <div className="text-xs text-gray-500">Tổng</div>
              <div className="text-xl font-black text-white">{totalStats}</div>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(STAT_LABELS).map(([key, label]) => (
              <StatBar key={key} label={label} value={pokemon.stats[key] || 0} />
            ))}
          </div>
        </div>
      )}

      {/* Abilities Tab */}
      {activeTab === 'abilities' && (
        <div className="space-y-4">
          {pokemon.abilities.map((a) => (
            <div key={a.name} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-white font-semibold capitalize">{formatName(a.name)}</h3>
                {a.isHidden && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Ẩn
                  </span>
                )}
              </div>
              {a.description ? (
                <p className="text-gray-300 text-sm leading-relaxed">{a.description}</p>
              ) : (
                <p className="text-gray-500 text-sm italic">Đang tải mô tả...</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Moves Tab */}
      {activeTab === 'moves' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-[#2a2a4a]">
            <h2 className="text-white font-semibold">Chiêu thức có thể học <span className="text-gray-500 text-sm">(30 đầu tiên)</span></h2>
          </div>
          <div className="divide-y divide-[#1e1e32]">
            {pokemon.moves.map((m) => (
              <div key={m.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors">
                <Link
                  to={`/pokedex/moves/${m.name}`}
                  className="text-white capitalize hover:text-indigo-400 transition-colors text-sm font-medium"
                >
                  {formatName(m.name)}
                </Link>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="capitalize">{m.learnMethod === 'level-up' ? `Lv.${m.level}` : m.learnMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
