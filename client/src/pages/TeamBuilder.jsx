import { useState, useEffect } from 'react'
import { Users, Plus, X, Search, AlertTriangle, Save, Trash2, ChevronDown } from 'lucide-react'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { TYPE_LIST, TYPE_EFFECTIVENESS, getTypeColor } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const EMPTY_SLOT = { pokemon: null, moves: [] }

export default function TeamBuilder() {
  const [teamName, setTeamName] = useState('')
  const [slots, setSlots] = useState(Array(6).fill(null).map(() => ({ ...EMPTY_SLOT })))
  const [savedTeams, setSavedTeams] = useState([])
  const [allPokemon, setAllPokemon] = useState([])
  const [selectorOpen, setSelectorOpen] = useState(null) // slot index
  const [moveSelector, setMoveSelector] = useState(null) // { slotIndex }
  const [searchPoke, setSearchPoke] = useState('')
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)
  const isAuth = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pokeRes, teamRes] = await Promise.all([
          api.get('/pokemon?limit=100'),
          isAuth ? api.get('/teams') : Promise.resolve({ data: { data: [] } }),
        ])
        setAllPokemon(pokeRes.data.data.pokemon || pokeRes.data.data || [])
        setSavedTeams(teamRes.data.data.teams || teamRes.data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAuth])

  const selectPokemon = (poke) => {
    const newSlots = [...slots]
    newSlots[selectorOpen] = { pokemon: poke, moves: [] }
    setSlots(newSlots)
    setSelectorOpen(null)
  }

  const removePokemon = (idx) => {
    const newSlots = [...slots]
    newSlots[idx] = { ...EMPTY_SLOT }
    setSlots(newSlots)
  }

  const toggleMove = (slotIdx, move) => {
    const newSlots = [...slots]
    const slot = { ...newSlots[slotIdx] }
    const moveIds = slot.moves.map((m) => m._id)
    if (moveIds.includes(move._id)) {
      slot.moves = slot.moves.filter((m) => m._id !== move._id)
    } else if (slot.moves.length < 4) {
      slot.moves = [...slot.moves, move]
    } else {
      toast.error('Maximum 4 moves per Pokémon')
      return
    }
    newSlots[slotIdx] = slot
    setSlots(newSlots)
  }

  const getCoverage = () => {
    const coveredTypes = new Set()
    slots.forEach((slot) => {
      if (!slot.pokemon) return
      slot.moves.forEach((m) => {
        const eff = TYPE_EFFECTIVENESS[m.type?.toLowerCase()]
        if (eff?.superEffective) {
          eff.superEffective.forEach((t) => coveredTypes.add(t))
        }
      })
      // Also consider STAB types
      if (slot.pokemon.primaryType) {
        const eff = TYPE_EFFECTIVENESS[slot.pokemon.primaryType.toLowerCase()]
        if (eff?.superEffective) eff.superEffective.forEach((t) => coveredTypes.add(t))
      }
      if (slot.pokemon.secondaryType) {
        const eff = TYPE_EFFECTIVENESS[slot.pokemon.secondaryType.toLowerCase()]
        if (eff?.superEffective) eff.superEffective.forEach((t) => coveredTypes.add(t))
      }
    })
    return TYPE_LIST.filter((t) => !coveredTypes.has(t))
  }

  const saveTeam = async () => {
    if (!isAuth) return toast.error('Please login to save teams')
    if (!teamName.trim()) return toast.error('Enter a team name')
    const filledSlots = slots.filter((s) => s.pokemon)
    if (filledSlots.length === 0) return toast.error('Add at least one Pokémon')

    try {
      const body = {
        name: teamName,
        pokemonList: filledSlots.map((s) => ({
          pokemon: s.pokemon._id,
          moves: s.moves.map((m) => m._id),
        })),
      }
      await api.post('/teams', body)
      toast.success('Team saved!')
      const res = await api.get('/teams')
      setSavedTeams(res.data.data.teams || res.data.data || [])
      setTeamName('')
      setSlots(Array(6).fill(null).map(() => ({ ...EMPTY_SLOT })))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    }
  }

  const deleteTeam = async (id) => {
    try {
      await api.delete(`/teams/${id}`)
      toast.success('Team deleted')
      setSavedTeams(savedTeams.filter((t) => t._id !== id))
    } catch {
      toast.error('Failed to delete')
    }
  }

  const uncoveredTypes = getCoverage()
  const filteredPokemon = allPokemon.filter((p) =>
    p.name.toLowerCase().includes(searchPoke.toLowerCase())
  )

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-400" /> Team Builder
        </h1>
        <p className="text-gray-400 mt-1">Build your competitive Pokémon team</p>
      </div>

      {/* Team Name */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Team name..."
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="input-field flex-1"
        />
        <button onClick={saveTeam} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Team
        </button>
      </div>

      {/* Team Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {slots.map((slot, idx) => (
          <div key={idx} className="glass-card p-4 relative group">
            {slot.pokemon ? (
              <>
                <button
                  onClick={() => removePokemon(idx)}
                  className="absolute top-2 right-2 p-1 rounded-lg bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="aspect-square bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-xl flex items-center justify-center mb-2 overflow-hidden">
                  {slot.pokemon.imageUrl ? (
                    <img src={slot.pokemon.imageUrl} alt={slot.pokemon.name} className="w-3/4 h-3/4 object-contain" />
                  ) : (
                    <span className="text-gray-600 text-2xl">?</span>
                  )}
                </div>
                <h4 className="text-white text-sm font-medium text-center truncate">{slot.pokemon.name}</h4>
                <div className="flex gap-1 justify-center mt-1">
                  <TypeBadge type={slot.pokemon.primaryType} />
                </div>
                {/* Moves */}
                <div className="mt-2 space-y-1">
                  {slot.moves.map((m) => (
                    <div key={m._id} className="text-[10px] text-gray-300 bg-[#12121a]/50 rounded px-1.5 py-0.5 truncate">
                      {m.name}
                    </div>
                  ))}
                  {slot.moves.length < 4 && (
                    <button
                      onClick={() => setMoveSelector({ slotIndex: idx })}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 w-full text-center py-0.5"
                    >
                      + Add Move ({4 - slot.moves.length} left)
                    </button>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => { setSelectorOpen(idx); setSearchPoke('') }}
                className="w-full aspect-square bg-[#12121a]/50 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#2a2a4a] hover:border-indigo-500/50 transition-colors"
              >
                <Plus className="w-8 h-8 text-gray-600" />
                <span className="text-xs text-gray-500">Slot {idx + 1}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Coverage Analysis */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Type Coverage Analysis</h2>
        {slots.some((s) => s.pokemon) ? (
          <>
            {uncoveredTypes.length > 0 ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-medium text-sm">Missing coverage for:</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {uncoveredTypes.map((t) => <TypeBadge key={t} type={t} />)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                <p className="text-green-400 font-medium text-sm">✓ Full type coverage achieved!</p>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {TYPE_LIST.map((t) => (
                <div
                  key={t}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    uncoveredTypes.includes(t)
                      ? 'opacity-30 border border-gray-600'
                      : 'text-white'
                  }`}
                  style={!uncoveredTypes.includes(t) ? { backgroundColor: getTypeColor(t) } : {}}
                >
                  {t}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Add Pokémon to see coverage analysis</p>
        )}
      </div>

      {/* Saved Teams */}
      {savedTeams.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Saved Teams</h2>
          <div className="space-y-4">
            {savedTeams.map((team) => (
              <div key={team._id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{team.name}</h3>
                  <button onClick={() => deleteTeam(team._id)} className="p-1.5 rounded-lg hover:bg-red-600/30 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {(team.pokemonList || []).map((entry, idx) => {
                    const poke = entry.pokemon || entry
                    return (
                      <div key={idx} className="flex-shrink-0 text-center">
                        <div className="w-16 h-16 bg-[#12121a]/50 rounded-xl flex items-center justify-center">
                          {poke?.imageUrl ? (
                            <img src={poke.imageUrl} alt={poke.name || ''} className="w-12 h-12 object-contain" />
                          ) : (
                            <span className="text-gray-600">?</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 mt-1 truncate w-16">{poke?.name || '—'}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pokémon Selector Modal */}
      <Modal isOpen={selectorOpen !== null} onClose={() => setSelectorOpen(null)} title="Select Pokémon">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search..." value={searchPoke} onChange={(e) => setSearchPoke(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1 pr-2">
            {filteredPokemon.map((p) => (
              <button
                key={p._id}
                onClick={() => selectPokemon(p)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#12121a] transition-colors text-left"
              >
                <div className="w-10 h-10 bg-[#12121a] rounded-lg flex items-center justify-center">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-contain" /> : <span className="text-gray-600">?</span>}
                </div>
                <div className="flex-1">
                  <span className="text-white font-medium">{p.name}</span>
                  <div className="flex gap-1 mt-0.5">
                    <TypeBadge type={p.primaryType} />
                    {p.secondaryType && <TypeBadge type={p.secondaryType} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Move Selector Modal */}
      <Modal
        isOpen={moveSelector !== null}
        onClose={() => setMoveSelector(null)}
        title={moveSelector !== null ? `Select Moves for ${slots[moveSelector?.slotIndex]?.pokemon?.name || ''}` : ''}
      >
        {moveSelector !== null && slots[moveSelector.slotIndex]?.pokemon && (
          <div className="max-h-80 overflow-y-auto space-y-1 pr-2">
            {(slots[moveSelector.slotIndex].pokemon.moves || []).map((m) => {
              const move = typeof m === 'object' ? m : { _id: m, name: '—' }
              const isSelected = slots[moveSelector.slotIndex].moves.some((sm) => sm._id === move._id)
              return (
                <button
                  key={move._id}
                  onClick={() => toggleMove(moveSelector.slotIndex, move)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                    isSelected ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-[#12121a]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TypeBadge type={move.type} />
                    <span className="text-white font-medium">{move.name}</span>
                  </div>
                  {isSelected && <span className="text-indigo-400 text-xs">✓</span>}
                </button>
              )
            })}
            {(!slots[moveSelector.slotIndex].pokemon.moves || slots[moveSelector.slotIndex].pokemon.moves.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No moves available for this Pokémon</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
