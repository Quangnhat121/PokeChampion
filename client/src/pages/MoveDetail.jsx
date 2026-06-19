import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Swords, Zap, Target, Flame, Crosshair } from 'lucide-react'
import api from '../services/api'
import { getTypeColor } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function MoveDetail() {
  const { id } = useParams()
  const [move, setMove] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/moves/${id}`)
        setMove(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!move) return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">Move not found</p>
      <Link to="/moves" className="text-indigo-400 hover:underline mt-2 inline-block">← Back to list</Link>
    </div>
  )

  const typeColor = getTypeColor(move.type)

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <Link to="/moves" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Moves
      </Link>

      {/* Hero */}
      <div className="glass-card overflow-hidden">
        <div className="p-8" style={{ background: `linear-gradient(135deg, ${typeColor}20 0%, transparent 60%)` }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="p-4 rounded-2xl" style={{ backgroundColor: `${typeColor}20` }}>
              <Swords className="w-12 h-12" style={{ color: typeColor }} />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{move.name}</h1>
              <div className="flex flex-wrap gap-3 items-center">
                <TypeBadge type={move.type} />
                <span className={`text-sm px-3 py-1 rounded-lg font-medium ${
                  move.category === 'Physical' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  move.category === 'Special' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {move.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400 mb-1">Power</div>
          <div className="text-3xl font-bold text-white">{move.power || '—'}</div>
        </div>
        <div className="glass-card p-6 text-center">
          <Crosshair className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400 mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-white">{move.accuracy || '—'}</div>
        </div>
        <div className="glass-card p-6 text-center">
          <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400 mb-1">PP</div>
          <div className="text-3xl font-bold text-white">{move.pp}</div>
        </div>
        <div className="glass-card p-6 text-center">
          <Crosshair className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400 mb-1">Range</div>
          <div className="text-xl font-bold text-white mt-1">{move.range || 'Đơn mục tiêu'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effect & Strategy */}
        <div className="space-y-6">
          {move.effect && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-3">⚡ Effect</h2>
              <p className="text-gray-300 leading-relaxed">{move.effect}</p>
            </div>
          )}
          {move.strategyNote && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-3">🎯 Combat Strategy</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{move.strategyNote}</p>
            </div>
          )}
        </div>

        {/* Pokemon that learn this move */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Pokémon That Learn This Move
          </h2>
          {!move.pokemonLearned || move.pokemonLearned.length === 0 ? (
            <p className="text-gray-500 text-sm">No Pokémon assigned to this move</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {move.pokemonLearned.map((p) => {
                const poke = typeof p === 'object' ? p : { _id: p, name: '—' }
                return (
                  <Link
                    key={poke._id}
                    to={`/pokemon/${poke._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#12121a]/50 hover:bg-[#12121a] border border-transparent hover:border-[#2a2a4a] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0f0f1a] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {poke.imageUrl ? (
                        <img src={poke.imageUrl} alt={poke.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <Zap className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                      {poke.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
