import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Zap, Swords, Shield, Heart, Wind, Star } from 'lucide-react'
import api from '../services/api'
import { getTypeColor, getStatColor } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import StatBar from '../components/ui/StatBar'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function PokemonDetail() {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/pokemon/${id}`)
        setPokemon(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!pokemon) return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">Pokémon not found</p>
      <Link to="/pokemon" className="text-indigo-400 hover:underline mt-2 inline-block">← Back to list</Link>
    </div>
  )

  const stats = [
    { label: 'HP', value: pokemon.stats?.hp || 0, icon: Heart },
    { label: 'Attack', value: pokemon.stats?.attack || 0, icon: Swords },
    { label: 'Defense', value: pokemon.stats?.defense || 0, icon: Shield },
    { label: 'Sp. Atk', value: pokemon.stats?.spAtk || 0, icon: Star },
    { label: 'Sp. Def', value: pokemon.stats?.spDef || 0, icon: Shield },
    { label: 'Speed', value: pokemon.stats?.speed || 0, icon: Wind },
  ]
  const bst = stats.reduce((sum, s) => sum + s.value, 0)
  const primaryColor = getTypeColor(pokemon.primaryType)

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Back */}
      <Link to="/pokemon" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Pokémon
      </Link>

      {/* Hero */}
      <div className="glass-card overflow-hidden">
        <div
          className="relative p-8 flex flex-col md:flex-row items-center gap-8"
          style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, transparent 60%)` }}
        >
          {/* Image */}
          <div className="relative w-64 h-64 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: primaryColor }}
            />
            {pokemon.imageUrl ? (
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                className="relative w-full h-full object-contain drop-shadow-2xl animate-[slideUp_0.6s_ease-out]"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <Zap className="w-24 h-24 text-gray-600" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-3">{pokemon.name}</h1>
            <div className="flex gap-2 justify-center md:justify-start mb-4">
              <TypeBadge type={pokemon.primaryType} />
              {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Ability</span>
                <p className="text-white font-medium">{pokemon.ability}</p>
              </div>
              <div>
                <span className="text-gray-400">Role</span>
                <p className="text-white font-medium">{pokemon.role || '—'}</p>
              </div>
              <div>
                <span className="text-gray-400">Base Stat Total</span>
                <p className="text-white font-bold text-lg">{bst}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Base Stats
          </h2>
          <div className="space-y-3">
            {stats.map((s) => (
              <StatBar key={s.label} label={s.label} value={s.value} maxValue={255} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#2a2a4a] flex justify-between">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="text-white font-bold">{bst}</span>
          </div>
        </div>

        {/* Moves */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5 text-indigo-400" /> Known Moves
          </h2>
          {!pokemon.moves || pokemon.moves.length === 0 ? (
            <p className="text-gray-500 text-sm">No moves assigned</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {pokemon.moves.map((m) => {
                const move = typeof m === 'object' ? m : { _id: m, name: '—' }
                return (
                  <Link
                    key={move._id}
                    to={`/moves/${move._id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#12121a]/50 hover:bg-[#12121a] border border-transparent hover:border-[#2a2a4a] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <TypeBadge type={move.type} />
                      <span className="text-white group-hover:text-indigo-300 transition-colors font-medium">{move.name}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400">
                      {move.category && <span className="bg-gray-800/50 px-2 py-0.5 rounded">{move.category}</span>}
                      {move.power > 0 && <span>PWR: {move.power}</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Strategy Section */}
      {(pokemon.pvpMoveset || pokemon.strategyNote) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pokemon.pvpMoveset && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-3">🎯 PvP Moveset</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{pokemon.pvpMoveset}</p>
            </div>
          )}
          {pokemon.strategyNote && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-3">📋 Strategy Notes</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{pokemon.strategyNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
