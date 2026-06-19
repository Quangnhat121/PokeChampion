import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useTypeDetail } from '../../hooks/usePokedex'
import { getTypeColor, getTypeVi, formatName } from '../../utils/pokedexUtils'
import PokeTypeBadge from '../../components/pokedex/PokeTypeBadge'

const RELATION_ORDER = [
  'double_damage_to',
  'half_damage_to',
  'no_damage_to',
  'double_damage_from',
  'half_damage_from',
  'no_damage_from',
]

const RELATION_COLORS = {
  double_damage_to: 'border-green-500/40 bg-green-500/5',
  half_damage_to: 'border-orange-500/40 bg-orange-500/5',
  no_damage_to: 'border-gray-500/40 bg-gray-500/5',
  double_damage_from: 'border-red-500/40 bg-red-500/5',
  half_damage_from: 'border-blue-500/40 bg-blue-500/5',
  no_damage_from: 'border-purple-500/40 bg-purple-500/5',
}

const RELATION_ICONS = {
  double_damage_to: '⚔️ 2×',
  half_damage_to: '🔵 ½×',
  no_damage_to: '🚫 0×',
  double_damage_from: '💥 2×',
  half_damage_from: '🛡️ ½×',
  no_damage_from: '✨ 0×',
}

export default function PokedexTypeDetail() {
  const { nameOrId } = useParams()
  const { data: type, loading, error } = useTypeDetail(nameOrId)

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Đang tải...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
        <Link to="/pokedex/types" className="btn-primary mt-4 inline-flex">← Quay lại</Link>
      </div>
    </div>
  )

  if (!type) return null

  const typeColor = getTypeColor(type.name)

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <Link to="/pokedex/types" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Danh sách hệ
      </Link>

      {/* Hero */}
      <div
        className="rounded-3xl p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${typeColor}25 0%, #1a1a2e 70%)`, border: `1px solid ${typeColor}40` }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: typeColor }} />
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-3" style={{ color: typeColor }}>
            Hệ {type.nameVi || getTypeVi(type.name)}
          </h1>
          <p className="text-gray-400 text-sm capitalize">{type.name} type</p>
        </div>
      </div>

      {/* Damage Relations */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quan hệ sát thương</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RELATION_ORDER.map((key) => {
            const rel = type.damageRelations?.[key]
            if (!rel || rel.types.length === 0) return null
            return (
              <div key={key} className={`rounded-2xl p-4 border ${RELATION_COLORS[key]}`}>
                <div className="text-sm font-semibold text-white mb-3">
                  {RELATION_ICONS[key]} {rel.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {rel.types.map((t) => (
                    <Link key={t.name} to={`/pokedex/types/${t.name}`}>
                      <PokeTypeBadge type={t.name} showVi size="xs" />
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pokemon of this type */}
      {type.pokemon?.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Pokémon thuộc hệ {type.nameVi} <span className="text-gray-500 text-sm">(20 đầu tiên)</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {type.pokemon.map((p) => (
              <Link
                key={p.name}
                to={`/pokedex/pokemon/${p.name}`}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                  loading="lazy"
                />
                <span className="text-xs text-gray-400 capitalize text-center group-hover:text-white transition-colors leading-tight">
                  {formatName(p.name)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Moves of this type */}
      {type.moves?.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Chiêu thức hệ {type.nameVi} <span className="text-gray-500 text-sm">(20 đầu tiên)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {type.moves.map((m) => (
              <Link
                key={m.name}
                to={`/pokedex/moves/${m.name}`}
                className="px-3 py-1.5 rounded-xl text-sm font-medium capitalize text-gray-300 hover:text-white transition-colors"
                style={{ backgroundColor: `${typeColor}20`, border: `1px solid ${typeColor}30` }}
              >
                {formatName(m.name)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
