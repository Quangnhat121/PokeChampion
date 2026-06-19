import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, AlertCircle, Swords } from 'lucide-react'
import { useMoveList } from '../../hooks/usePokedex'
import { getTypeColor, getTypeVi, getCategoryVi, formatName } from '../../utils/pokedexUtils'
import PokeTypeBadge from '../../components/pokedex/PokeTypeBadge'
import { TYPE_VI } from '../../utils/pokedexUtils'

export default function PokedexMovesList() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const debounceRef = useRef(null)

  const { data, pagination, loading, error, setParams } = useMoveList()

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  useEffect(() => {
    setParams({ page, limit: 20, search: debouncedSearch, type: typeFilter })
  }, [page, debouncedSearch, typeFilter])

  const totalPages = pagination?.pages || 1

  const CATEGORY_ICONS = {
    physical: '⚔️',
    special: '✨',
    status: '🔄',
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Swords className="w-8 h-8 text-purple-400" />
          Danh Sách Chiêu Thức
        </h1>
        <p className="text-gray-400 mt-1">
          {pagination?.total?.toLocaleString() || '919'} chiêu thức từ PokeAPI
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm chiêu thức (vd: flamethrower...)"
            className="input-field pl-10 w-full"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="input-field w-48"
        >
          <option value="">Tất cả hệ</option>
          {Object.entries(TYPE_VI).map(([key, vi]) => (
            <option key={key} value={key}>{vi}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a4a]">
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hệ</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Loại</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sức Mạnh</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Độ Chính Xác</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">PP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e32]">
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="p-4">
                          <div className="h-4 bg-[#2a2a4a] rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data.map((move) => (
                    <tr
                      key={move.name}
                      className="hover:bg-white/3 transition-colors group"
                    >
                      <td className="p-4">
                        <Link
                          to={`/pokedex/moves/${move.name}`}
                          className="text-white font-medium capitalize hover:text-indigo-400 transition-colors"
                        >
                          {formatName(move.name)}
                        </Link>
                      </td>
                      <td className="p-4">
                        <PokeTypeBadge type={move.type} size="xs" />
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-400">
                          {CATEGORY_ICONS[move.category]} {getCategoryVi(move.category)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {move.power ? (
                          <span className="text-white font-bold tabular-nums">{move.power}</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {move.accuracy ? (
                          <span className="text-gray-300 tabular-nums">{move.accuracy}%</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-gray-300 tabular-nums">{move.pp ?? '—'}</span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && data.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">⚔️</div>
            <p className="text-gray-400">Không tìm thấy chiêu thức nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-300 text-sm">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
