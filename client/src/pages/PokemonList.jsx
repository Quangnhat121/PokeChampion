import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Search, Plus, Pencil, Trash2, LayoutGrid, List } from 'lucide-react'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { TYPE_LIST, ROLE_LIST, getTypeColor } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [deleteId, setDeleteId] = useState(null)
  const user = useAuthStore((s) => s.user)

  const fetchPokemon = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      if (roleFilter) params.role = roleFilter
      const res = await api.get('/pokemon', { params })
      const data = res.data.data
      setPokemon(data.pokemon || data || [])
      setTotalPages(data.pagination?.pages || data.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemon()
  }, [page, typeFilter, roleFilter])

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      fetchPokemon()
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/pokemon/${deleteId}`)
      toast.success('Pokémon deleted!')
      setDeleteId(null)
      fetchPokemon()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const getStatTotal = (stats) => {
    if (!stats) return 0
    return (stats.hp || 0) + (stats.attack || 0) + (stats.defense || 0) +
      (stats.spAtk || 0) + (stats.spDef || 0) + (stats.speed || 0)
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Pokémon
          </h1>
          <p className="text-gray-400 mt-1">Browse and manage your Pokémon collection</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/admin?tab=pokemon" className="btn-primary flex items-center gap-2 w-fit">
            <Plus className="w-4 h-4" /> Add Pokémon
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="input-field w-full sm:w-40"
        >
          <option value="">All Types</option>
          {TYPE_LIST.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="input-field w-full sm:w-44"
        >
          <option value="">All Roles</option>
          {ROLE_LIST.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <div className="flex gap-1 bg-[#12121a] rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : pokemon.length === 0 ? (
        <EmptyState icon={Zap} title="No Pokémon found" description="Try adjusting your filters or add new Pokémon." />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pokemon.map((p) => (
            <Link
              key={p._id}
              to={`/pokemon/${p._id}`}
              className="glass-card p-4 hover:scale-[1.03] hover:border-indigo-500/50 transition-all duration-300 group relative"
            >
              {user?.role === 'admin' && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Link
                    to={`/admin?tab=pokemon&edit=${p._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(p._id) }}
                    className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="aspect-square bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <Zap className="w-16 h-16 text-gray-700" />
                )}
              </div>
              <h3 className="font-semibold text-white text-lg group-hover:text-indigo-300 transition-colors">
                {p.name}
              </h3>
              <div className="flex gap-2 mt-2">
                <TypeBadge type={p.primaryType} />
                {p.secondaryType && <TypeBadge type={p.secondaryType} />}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span>{p.role || '—'}</span>
                <span className="font-medium text-gray-300">BST: {getStatTotal(p.stats)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a4a] text-left text-gray-400">
                <th className="p-4">Pokémon</th>
                <th className="p-4">Type</th>
                <th className="p-4 hidden md:table-cell">Ability</th>
                <th className="p-4 hidden md:table-cell">Role</th>
                <th className="p-4">BST</th>
                {user?.role === 'admin' && <th className="p-4 w-20"></th>}
              </tr>
            </thead>
            <tbody>
              {pokemon.map((p) => (
                <tr key={p._id} className="border-b border-[#2a2a4a]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <Link to={`/pokemon/${p._id}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-[#12121a] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <Zap className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <span className="font-medium text-white group-hover:text-indigo-300 transition-colors">{p.name}</span>
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <TypeBadge type={p.primaryType} />
                      {p.secondaryType && <TypeBadge type={p.secondaryType} />}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 hidden md:table-cell">{p.ability}</td>
                  <td className="p-4 text-gray-400 hidden md:table-cell">{p.role || '—'}</td>
                  <td className="p-4 text-gray-300 font-medium">{getStatTotal(p.stats)}</td>
                  {user?.role === 'admin' && (
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Link to={`/admin?tab=pokemon&edit=${p._id}`} className="p-1.5 rounded-lg hover:bg-indigo-600/30 text-gray-400 hover:text-indigo-400 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg hover:bg-red-600/30 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Pokémon"
        message="Are you sure you want to delete this Pokémon? This action cannot be undone."
      />
    </div>
  )
}
