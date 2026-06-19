import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Search, Plus, Pencil, Trash2, LayoutGrid, List, ArrowUpDown } from 'lucide-react'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { TYPE_LIST, CATEGORY_LIST } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

export default function MovesList() {
  const [moves, setMoves] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const [deleteId, setDeleteId] = useState(null)
  const user = useAuthStore((s) => s.user)

  const fetchMoves = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20, sort: sortBy, order: sortOrder }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      if (catFilter) params.category = catFilter
      const res = await api.get('/moves', { params })
      const data = res.data.data
      setMoves(data.moves || data || [])
      setTotalPages(data.pagination?.pages || data.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMoves() }, [page, typeFilter, catFilter, sortBy, sortOrder])

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchMoves() }, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/moves/${deleteId}`)
      toast.success('Move deleted!')
      setDeleteId(null)
      fetchMoves()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const SortHeader = ({ field, children }) => (
    <th
      className="p-4 cursor-pointer hover:text-indigo-400 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortBy === field && (
          <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
        )}
      </div>
    </th>
  )

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Swords className="w-8 h-8 text-cyan-400" /> Moves
          </h1>
          <p className="text-gray-400 mt-1">Browse and manage Pokémon moves</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/admin?tab=moves" className="btn-primary flex items-center gap-2 w-fit">
            <Plus className="w-4 h-4" /> Add Move
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search moves..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }} className="input-field w-full sm:w-40">
          <option value="">All Types</option>
          {TYPE_LIST.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1) }} className="input-field w-full sm:w-36">
          <option value="">All Categories</option>
          {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1 bg-[#12121a] rounded-xl p-1">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg transition-colors ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : moves.length === 0 ? (
        <EmptyState icon={Swords} title="No moves found" description="Try adjusting your filters or add new moves." />
      ) : viewMode === 'table' ? (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a4a] text-left text-gray-400">
                <SortHeader field="name">Name</SortHeader>
                <th className="p-4">Type</th>
                <th className="p-4">Category</th>
                <SortHeader field="power">Power</SortHeader>
                <SortHeader field="accuracy">Accuracy</SortHeader>
                <SortHeader field="pp">PP</SortHeader>
                <th className="p-4">Range</th>
                <th className="p-4 hidden lg:table-cell">Effect</th>
                {user?.role === 'admin' && <th className="p-4 w-20"></th>}
              </tr>
            </thead>
            <tbody>
              {moves.map((m) => (
                <tr key={m._id} className="border-b border-[#2a2a4a]/50 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <Link to={`/moves/${m._id}`} className="text-white font-medium hover:text-indigo-300 transition-colors">
                      {m.name}
                    </Link>
                  </td>
                  <td className="p-4"><TypeBadge type={m.type} /></td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      m.category === 'Physical' ? 'bg-orange-500/10 text-orange-400' :
                      m.category === 'Special' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {m.category}
                    </span>
                  </td>
                  <td className="p-4 text-white font-medium">{m.power || '—'}</td>
                  <td className="p-4 text-gray-300">{m.accuracy || '—'}</td>
                  <td className="p-4 text-gray-300">{m.pp}</td>
                  <td className="p-4 text-gray-300 whitespace-nowrap text-xs">{m.range || 'Đơn mục tiêu'}</td>
                  <td className="p-4 text-gray-400 text-xs max-w-[200px] truncate hidden lg:table-cell">{m.effect || '—'}</td>
                  {user?.role === 'admin' && (
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Link to={`/admin?tab=moves&edit=${m._id}`} className="p-1.5 rounded-lg hover:bg-indigo-600/30 text-gray-400 hover:text-indigo-400 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => setDeleteId(m._id)} className="p-1.5 rounded-lg hover:bg-red-600/30 text-gray-400 hover:text-red-400 transition-colors">
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {moves.map((m) => (
            <Link key={m._id} to={`/moves/${m._id}`} className="glass-card p-4 hover:scale-[1.03] hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <TypeBadge type={m.type} />
                <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                  m.category === 'Physical' ? 'bg-orange-500/10 text-orange-400' :
                  m.category === 'Special' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>{m.category}</span>
              </div>
              <h3 className="font-semibold text-white text-lg group-hover:text-indigo-300 transition-colors">{m.name}</h3>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center bg-[#12121a]/50 rounded-lg p-2">
                  <div className="text-xs text-gray-500">Power</div>
                  <div className="text-white font-bold">{m.power || '—'}</div>
                </div>
                <div className="text-center bg-[#12121a]/50 rounded-lg p-2">
                  <div className="text-xs text-gray-500">Acc</div>
                  <div className="text-white font-bold">{m.accuracy || '—'}</div>
                </div>
                <div className="text-center bg-[#12121a]/50 rounded-lg p-2">
                  <div className="text-xs text-gray-500">PP</div>
                  <div className="text-white font-bold">{m.pp}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-indigo-400 font-medium">Range: {m.range || 'Đơn mục tiêu'}</div>
              {m.effect && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{m.effect}</p>}
            </Link>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Move" message="Are you sure? This action cannot be undone." />
    </div>
  )
}
