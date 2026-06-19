import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Swords, Zap, Grid3x3, TrendingUp, Plus, ChevronRight, Globe } from 'lucide-react'
import api from '../services/api'
import { getTypeColor } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentPokemon, setRecentPokemon] = useState([])
  const [recentMoves, setRecentMoves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pokemonRes, movesRes] = await Promise.all([
          api.get('/stats'),
          api.get('/pokemon?limit=4&sort=createdAt&order=desc'),
          api.get('/moves?limit=4&sort=createdAt&order=desc'),
        ])
        setStats(statsRes.data.data)
        setRecentPokemon(pokemonRes.data.data.pokemon || pokemonRes.data.data || [])
        setRecentMoves(movesRes.data.data.moves || movesRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />

  const statCards = [
    {
      label: 'Pokémon (DB)',
      value: stats?.totalPokemon || 0,
      icon: Zap,
      gradient: 'from-violet-600 to-indigo-600',
      shadowColor: 'shadow-violet-500/20',
    },
    {
      label: 'Moves (DB)',
      value: stats?.totalMoves || 0,
      icon: Swords,
      gradient: 'from-cyan-600 to-blue-600',
      shadowColor: 'shadow-cyan-500/20',
    },
    {
      label: 'Types',
      value: stats?.totalTypes || 18,
      icon: Grid3x3,
      gradient: 'from-emerald-600 to-green-600',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      label: 'Strongest Move',
      value: stats?.strongestMove?.name || '—',
      subValue: stats?.strongestMove ? `${stats.strongestMove.power} PWR` : '',
      icon: TrendingUp,
      gradient: 'from-amber-600 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
    },
  ]

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-indigo-400" />
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1">Chào mừng đến PokédexChampion — Pokémon moves database & PokeAPI realtime</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`glass-card p-6 hover:scale-[1.02] transition-all duration-300 ${card.shadowColor} hover:shadow-lg group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              {card.value}
            </div>
            <div className="text-sm text-gray-400 mt-1">{card.label}</div>
            {card.subValue && (
              <div className="text-xs text-indigo-400 mt-1 font-medium">{card.subValue}</div>
            )}
          </div>
        ))}
      </div>

      {/* PokeAPI Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-colors">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-emerald-500/10" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <Globe className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">PokeAPI · Dữ liệu Realtime</h3>
            <p className="text-gray-400 text-sm">
              Khám phá {(stats?.totalPokemonPokeApi || 1302).toLocaleString()} Pokémon, {(stats?.totalMovesPokeApi || 919).toLocaleString()} chiêu thức,
              18 hệ với mô tả tiếng Việt — tất cả từ PokeAPI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/pokedex/pokemon" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" /> Pokédex
            </Link>
            <Link to="/pokedex/moves" className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
              <Swords className="w-4 h-4" /> Chiêu Thức
            </Link>
            <Link to="/pokedex/types" className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" /> Bảng Hệ
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Pokémon */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Pokémon gần đây (DB)</h2>
          <Link to="/pokemon" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recentPokemon.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Chưa có Pokémon nào. Hãy chạy <code className="text-indigo-400">npm run seed</code></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPokemon.map((p) => (
              <Link
                key={p._id}
                to={`/pokemon/${p._id}`}
                className="glass-card p-4 hover:scale-[1.03] hover:border-indigo-500/50 transition-all duration-300 group"
              >
                <div className="aspect-square bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Zap className="w-12 h-12 text-gray-600" />
                  )}
                </div>
                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{p.name}</h3>
                <div className="flex gap-2 mt-2">
                  <TypeBadge type={p.primaryType} />
                  {p.secondaryType && <TypeBadge type={p.secondaryType} />}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Moves */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Chiêu thức gần đây (DB)</h2>
          <Link to="/moves" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recentMoves.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-500">
            <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Chưa có chiêu thức nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentMoves.map((m) => (
              <Link
                key={m._id}
                to={`/moves/${m._id}`}
                className="glass-card p-4 hover:scale-[1.03] hover:border-indigo-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <TypeBadge type={m.type} />
                  <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-lg">{m.category}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{m.name}</h3>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>PWR: <span className="text-white font-medium">{m.power || '—'}</span></span>
                  <span>ACC: <span className="text-white font-medium">{m.accuracy || '—'}</span></span>
                  <span>PP: <span className="text-white font-medium">{m.pp}</span></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Hành động nhanh</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/pokedex/pokemon" className="btn-primary flex items-center gap-2">
            <Globe className="w-4 h-4" /> Pokédex (PokeAPI)
          </Link>
          <Link to="/pokemon" className="btn-primary flex items-center gap-2">
            <Zap className="w-4 h-4" /> Pokémon (DB)
          </Link>
          <Link to="/moves" className="btn-ghost border border-[#2a2a4a] flex items-center gap-2">
            <Swords className="w-4 h-4" /> Moves (DB)
          </Link>
          <Link to="/type-chart" className="btn-ghost border border-[#2a2a4a] flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" /> Type Chart
          </Link>
          <Link to="/team-builder" className="btn-ghost border border-[#2a2a4a] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Build Team
          </Link>
        </div>
      </section>
    </div>
  )
}
