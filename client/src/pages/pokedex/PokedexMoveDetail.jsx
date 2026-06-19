import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, Swords } from 'lucide-react'
import { useMoveDetail } from '../../hooks/usePokedex'
import { getTypeColor, getTypeVi, getCategoryVi, formatName, padId } from '../../utils/pokedexUtils'
import PokeTypeBadge from '../../components/pokedex/PokeTypeBadge'

const CATEGORY_ICONS = { physical: '⚔️', special: '✨', status: '🔄' }

function StatCard({ label, value, sub }) {
  return (
    <div className="glass-card p-4 text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function PokedexMoveDetail() {
  const { nameOrId } = useParams()
  const { data: move, loading, error } = useMoveDetail(nameOrId)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Đang tải từ PokeAPI...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
        <Link to="/pokedex/moves" className="btn-primary mt-4 inline-flex">← Quay lại</Link>
      </div>
    </div>
  )

  if (!move) return null

  const typeColor = getTypeColor(move.type)

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <Link to="/pokedex/moves" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Danh sách chiêu thức
      </Link>

      {/* Hero */}
      <div
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${typeColor}25 0%, #1a1a2e 70%)`, border: `1px solid ${typeColor}40` }}
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: typeColor }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Swords className="w-8 h-8" style={{ color: typeColor }} />
                <h1 className="text-4xl font-black text-white capitalize">{formatName(move.name)}</h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <PokeTypeBadge type={move.type} showVi size="md" />
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                  {CATEGORY_ICONS[move.category]} {getCategoryVi(move.category)}
                </span>
                {move.priority !== 0 && (
                  <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                    Ưu tiên {move.priority > 0 ? '+' : ''}{move.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Sức Mạnh" value={move.power} />
        <StatCard label="Độ Chính Xác" value={move.accuracy ? `${move.accuracy}%` : null} />
        <StatCard label="PP" value={move.pp} />
        <StatCard label="Tỷ lệ hiệu ứng" value={move.effectChance ? `${move.effectChance}%` : null} />
      </div>

      {/* Effect - Vietnamese */}
      {move.effectVi && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-xl">🇻🇳</span> Hiệu ứng (Tiếng Việt)
          </h2>
          <p className="text-gray-200 leading-relaxed text-sm">{move.effectVi}</p>
        </div>
      )}

      {/* Flavor text Vietnamese */}
      {move.flavorVi && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Mô tả</h2>
          <p className="text-gray-300 italic leading-relaxed text-sm border-l-2 pl-4" style={{ borderColor: typeColor }}>
            "{move.flavorVi}"
          </p>
        </div>
      )}

      {/* Original English effect */}
      {move.effect && (
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Effect (English)</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{move.effect}</p>
        </div>
      )}

      {/* Pokemon that learn this move */}
      {move.pokemonLearned?.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Pokémon học được <span className="text-gray-500 text-sm">(20 đầu tiên)</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {move.pokemonLearned.map((p) => (
              <Link
                key={p.name}
                to={`/pokedex/pokemon/${p.name}`}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                  onError={(e) => { e.target.src = p.sprite }}
                />
                <span className="text-xs text-gray-400 capitalize text-center group-hover:text-white transition-colors">
                  {formatName(p.name)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
