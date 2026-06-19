import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Filter } from 'lucide-react'
import { usePokemonList } from '../../hooks/usePokedex'
import { getTypeColor, getTypeVi, formatName, padId } from '../../utils/pokedexUtils'
import PokeTypeBadge from '../../components/pokedex/PokeTypeBadge'

export default function PokedexPokemonList() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const debounceRef = useRef(null)

  const { data, pagination, loading, error, setParams } = usePokemonList()

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  useEffect(() => {
    setParams({ page, limit: 24, search: debouncedSearch })
  }, [page, debouncedSearch])

  const totalPages = pagination?.pages || 1

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🔴</span> Pokédex
        </h1>
        <p className="text-gray-400 mt-1">Khám phá {pagination?.total?.toLocaleString() || '1,302'} Pokémon từ PokeAPI</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm Pokémon (vd: pikachu, char...)"
          className="input-field pl-10 w-full"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="w-full aspect-square bg-[#2a2a4a] rounded-xl mb-3" />
              <div className="h-3 bg-[#2a2a4a] rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-[#2a2a4a] rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.map((pokemon) => (
            <Link
              key={pokemon.id}
              to={`/pokedex/pokemon/${pokemon.name}`}
              className="glass-card p-4 text-center hover:border-[#4a4a7a] hover:scale-105 transition-all duration-200 group cursor-pointer"
            >
              {/* ID */}
              <span className="text-[10px] text-gray-500 font-mono">#{padId(pokemon.id)}</span>

              {/* Image */}
              <div className="relative my-2">
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: getTypeColor(pokemon.types[0]) }}
                />
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-full aspect-square object-contain relative z-10 drop-shadow-lg group-hover:drop-shadow-2xl transition-all"
                  loading="lazy"
                  onError={(e) => { e.target.src = pokemon.sprite }}
                />
              </div>

              {/* Name */}
              <p className="text-white font-semibold text-sm mb-2 capitalize">
                {formatName(pokemon.name)}
              </p>

              {/* Types */}
              <div className="flex flex-wrap gap-1 justify-center">
                {pokemon.types.map((t) => (
                  <PokeTypeBadge key={t} type={t} size="xs" />
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">Không tìm thấy Pokémon nào</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p
              if (totalPages <= 5) p = i + 1
              else if (page <= 3) p = i + 1
              else if (page >= totalPages - 2) p = totalPages - 4 + i
              else p = page - 2 + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[36px] h-9 rounded-xl text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="text-gray-500 text-sm ml-2">
            Trang {page}/{totalPages}
          </span>
        </div>
      )}
    </div>
  )
}
