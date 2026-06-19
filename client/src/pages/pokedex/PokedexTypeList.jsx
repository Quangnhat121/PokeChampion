import { Link } from 'react-router-dom'
import { useTypeList } from '../../hooks/usePokedex'
import { getTypeColor, getTypeVi } from '../../utils/pokedexUtils'
import { AlertCircle, Grid3X3 } from 'lucide-react'

const TYPE_DESCRIPTIONS = {
  normal: 'Hệ Thường không có điểm mạnh đặc biệt nhưng cũng ít điểm yếu.',
  fire: 'Hệ Lửa mạnh với Cỏ, Băng, Bọ, Thép. Yếu với Nước, Đất, Đá.',
  water: 'Hệ Nước mạnh với Lửa, Đất, Đá. Yếu với Điện, Cỏ.',
  electric: 'Hệ Điện mạnh với Nước, Bay. Yếu với Đất. Miễn nhiễm Đất.',
  grass: 'Hệ Cỏ mạnh với Nước, Đất, Đá. Có nhiều điểm yếu.',
  ice: 'Hệ Băng mạnh với Cỏ, Đất, Bay, Rồng. Yếu với Lửa, Cách Đấu, Đá, Thép.',
  fighting: 'Hệ Cách Đấu mạnh với Thường, Băng, Đá, Bóng Tối, Thép.',
  poison: 'Hệ Độc mạnh với Cỏ, Tiên. Yếu với Đất, Siêu Năng.',
  ground: 'Hệ Đất mạnh với Lửa, Điện, Độc, Đá, Thép. Miễn nhiễm Điện.',
  flying: 'Hệ Bay mạnh với Cỏ, Cách Đấu, Bọ. Miễn nhiễm Đất.',
  psychic: 'Hệ Siêu Năng mạnh với Cách Đấu, Độc. Yếu với Bọ, Ma, Bóng Tối.',
  bug: 'Hệ Bọ mạnh với Cỏ, Siêu Năng, Bóng Tối. Nhiều điểm yếu.',
  rock: 'Hệ Đá mạnh với Lửa, Băng, Bay, Bọ. Nhiều điểm yếu.',
  ghost: 'Hệ Ma mạnh với Siêu Năng, Ma. Miễn nhiễm Thường, Cách Đấu.',
  dragon: 'Hệ Rồng mạnh với Rồng. Yếu với Băng, Rồng, Tiên. Miễn nhiễm Tiên.',
  dark: 'Hệ Bóng Tối mạnh với Siêu Năng, Ma. Yếu với Cách Đấu, Bọ, Tiên.',
  steel: 'Hệ Thép mạnh với Băng, Đá, Tiên. Kháng rất nhiều hệ.',
  fairy: 'Hệ Tiên mạnh với Cách Đấu, Rồng, Bóng Tối. Miễn nhiễm Rồng.',
}

export default function PokedexTypeList() {
  const { data: types, loading, error } = useTypeList()

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Grid3X3 className="w-8 h-8 text-yellow-400" />
          Bảng Hệ Pokémon
        </h1>
        <p className="text-gray-400 mt-1">18 hệ với quan hệ tương khắc đầy đủ</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-8 bg-[#2a2a4a] rounded-full w-24 mb-3" />
                <div className="h-4 bg-[#2a2a4a] rounded w-full mb-2" />
                <div className="h-4 bg-[#2a2a4a] rounded w-3/4" />
              </div>
            ))
          : types.map((type) => {
              const color = getTypeColor(type.name)
              return (
                <Link
                  key={type.name}
                  to={`/pokedex/types/${type.name}`}
                  className="glass-card p-5 hover:border-[#4a4a7a] hover:scale-[1.02] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-4 py-1.5 rounded-full text-white font-bold text-sm uppercase tracking-wider"
                      style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}50` }}
                    >
                      {type.nameVi || getTypeVi(type.name)}
                    </span>
                    <span className="text-gray-500 text-xs capitalize">{type.name}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {TYPE_DESCRIPTIONS[type.name] || ''}
                  </p>
                  <div
                    className="mt-3 text-xs font-medium group-hover:translate-x-1 transition-transform"
                    style={{ color }}
                  >
                    Xem chi tiết →
                  </div>
                </Link>
              )
            })}
      </div>
    </div>
  )
}
