import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Zap, Swords, Plus, Pencil, Trash2, Save, X, Search } from 'lucide-react'
import api from '../services/api'
import { TYPE_LIST, CATEGORY_LIST, ROLE_LIST } from '../utils/typeData'
import TypeBadge from '../components/ui/TypeBadge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const pokemonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: z.string().optional(),
  primaryType: z.string().min(1, 'Primary type is required'),
  secondaryType: z.string().optional(),
  ability: z.string().min(1, 'Ability is required'),
  hp: z.coerce.number().min(0).max(255),
  attack: z.coerce.number().min(0).max(255),
  defense: z.coerce.number().min(0).max(255),
  spAtk: z.coerce.number().min(0).max(255),
  spDef: z.coerce.number().min(0).max(255),
  speed: z.coerce.number().min(0).max(255),
  role: z.string().optional(),
  pvpMoveset: z.string().optional(),
  strategyNote: z.string().optional(),
})

const moveSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  category: z.string().min(1, 'Category is required'),
  power: z.coerce.number().min(0).default(0),
  accuracy: z.coerce.number().min(0).max(100).default(100),
  pp: z.coerce.number().min(1, 'PP is required'),
  range: z.enum([
    'Đơn mục tiêu',
    'Tất cả mục tiêu',
    'Bản thân',
    'Toàn bộ sân đấu',
    'Tất cả đồng minh',
    'Một đồng minh',
    'Tất cả Pokémon xung quanh',
  ]).default('Đơn mục tiêu'),
  effect: z.string().optional(),
  strategyNote: z.string().optional(),
})

function PokemonForm({ editData, onSaved, allMoves }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(pokemonSchema),
    defaultValues: editData ? {
      ...editData,
      hp: editData.stats?.hp || 0,
      attack: editData.stats?.attack || 0,
      defense: editData.stats?.defense || 0,
      spAtk: editData.stats?.spAtk || 0,
      spDef: editData.stats?.spDef || 0,
      speed: editData.stats?.speed || 0,
    } : {},
  })
  const [selectedMoves, setSelectedMoves] = useState(
    editData?.moves?.map((m) => typeof m === 'object' ? m._id : m) || []
  )
  const [saving, setSaving] = useState(false)
  const [fetchName, setFetchName] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const handleFetchPokeApi = async () => {
    if (!fetchName.trim()) return
    setIsFetching(true)
    try {
      const res = await api.get(`/pokedex/pokemon/${fetchName.trim().toLowerCase()}`)
      const p = res.data.data
      
      const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
      
      reset({
        name: capitalize(p.name),
        imageUrl: p.image || p.sprite || '',
        primaryType: p.types[0] || '',
        secondaryType: p.types[1] || '',
        ability: p.abilities[0]?.name ? capitalize(p.abilities[0].name) : '',
        hp: p.stats.hp,
        attack: p.stats.attack,
        defense: p.stats.defense,
        spAtk: p.stats.spAtk,
        spDef: p.stats.spDef,
        speed: p.stats.speed,
        strategyNote: p.flavorText || '',
      })
      toast.success('Fetched from PokeAPI!')
    } catch (err) {
      toast.error('Pokemon not found in PokeAPI')
    } finally {
      setIsFetching(false)
    }
  }

  const toggleMove = (id) => {
    setSelectedMoves((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const body = {
        name: data.name,
        imageUrl: data.imageUrl || '',
        primaryType: data.primaryType,
        secondaryType: data.secondaryType || '',
        ability: data.ability,
        stats: {
          hp: data.hp, attack: data.attack, defense: data.defense,
          spAtk: data.spAtk, spDef: data.spDef, speed: data.speed,
        },
        role: data.role || '',
        moves: selectedMoves,
        pvpMoveset: data.pvpMoveset || '',
        strategyNote: data.strategyNote || '',
      }
      if (editData) {
        await api.put(`/pokemon/${editData._id}`, body)
        toast.success('Pokémon updated!')
      } else {
        await api.post('/pokemon', body)
        toast.success('Pokémon created!')
      }
      reset()
      setSelectedMoves([])
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Fetch from PokeAPI */}
      <div className="flex gap-2 mb-4 bg-[#1a1a2e] p-3 rounded-xl border border-indigo-500/30">
        <input 
          type="text" 
          placeholder="Enter Pokemon name or ID..." 
          className="input-field flex-1"
          value={fetchName}
          onChange={(e) => setFetchName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleFetchPokeApi();
            }
          }}
        />
        <button 
          type="button" 
          onClick={handleFetchPokeApi} 
          disabled={isFetching}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {isFetching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
          Fetch PokeAPI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Name *</label>
          <input {...register('name')} className="input-field" placeholder="Pikachu" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
          <input {...register('imageUrl')} className="input-field" placeholder="https://..." />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Primary Type *</label>
          <select {...register('primaryType')} className="input-field">
            <option value="">Select type</option>
            {TYPE_LIST.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          {errors.primaryType && <p className="text-red-400 text-xs mt-1">{errors.primaryType.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Secondary Type</label>
          <select {...register('secondaryType')} className="input-field">
            <option value="">None</option>
            {TYPE_LIST.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Ability *</label>
          <input {...register('ability')} className="input-field" placeholder="Static" />
          {errors.ability && <p className="text-red-400 text-xs mt-1">{errors.ability.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Role</label>
          <select {...register('role')} className="input-field">
            <option value="">Select role</option>
            {ROLE_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Base Stats</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { field: 'hp', label: 'HP' },
            { field: 'attack', label: 'ATK' },
            { field: 'defense', label: 'DEF' },
            { field: 'spAtk', label: 'SPA' },
            { field: 'spDef', label: 'SPD' },
            { field: 'speed', label: 'SPE' },
          ].map((s) => (
            <div key={s.field} className="text-center">
              <label className="text-xs text-gray-500">{s.label}</label>
              <input {...register(s.field)} type="number" min="0" max="255" className="input-field text-center" />
            </div>
          ))}
        </div>
      </div>

      {/* Moves selection */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Moves ({selectedMoves.length} selected)</label>
        <div className="max-h-40 overflow-y-auto bg-[#12121a] rounded-xl p-3 space-y-1">
          {allMoves.map((m) => (
            <label key={m._id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMoves.includes(m._id)}
                onChange={() => toggleMove(m._id)}
                className="rounded border-gray-600 bg-[#0a0a0f] text-indigo-600 focus:ring-indigo-500"
              />
              <TypeBadge type={m.type} />
              <span className="text-sm text-gray-300">{m.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">PvP Moveset</label>
        <textarea {...register('pvpMoveset')} className="input-field" rows="2" placeholder="Recommended moveset..." />
      </div>
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Strategy Note</label>
        <textarea {...register('strategyNote')} className="input-field" rows="2" placeholder="Strategy tips..." />
      </div>

      <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
        {editData ? 'Update' : 'Create'} Pokémon
      </button>
    </form>
  )
}

function MoveForm({ editData, onSaved, allPokemon }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(moveSchema),
    defaultValues: editData || { range: 'Đơn mục tiêu' },
  })
  const [selectedPokemon, setSelectedPokemon] = useState(
    editData?.pokemonLearned?.map((p) => typeof p === 'object' ? p._id : p) || []
  )
  const [saving, setSaving] = useState(false)

  const togglePokemon = (id) => {
    setSelectedPokemon((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const body = { ...data, pokemonLearned: selectedPokemon }
      if (editData) {
        await api.put(`/moves/${editData._id}`, body)
        toast.success('Move updated!')
      } else {
        await api.post('/moves', body)
        toast.success('Move created!')
      }
      reset()
      setSelectedPokemon([])
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Name *</label>
          <input {...register('name')} className="input-field" placeholder="Thunderbolt" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Type *</label>
          <select {...register('type')} className="input-field">
            <option value="">Select type</option>
            {TYPE_LIST.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Category *</label>
          <select {...register('category')} className="input-field">
            <option value="">Select</option>
            {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Range *</label>
          <select {...register('range')} className="input-field">
            <option value="Đơn mục tiêu">Đơn mục tiêu</option>
            <option value="Tất cả mục tiêu">Tất cả mục tiêu</option>
            <option value="Bản thân">Bản thân</option>
            <option value="Toàn bộ sân đấu">Toàn bộ sân đấu</option>
            <option value="Tất cả đồng minh">Tất cả đồng minh</option>
            <option value="Một đồng minh">Một đồng minh</option>
            <option value="Tất cả Pokémon xung quanh">Tất cả Pokémon xung quanh</option>
          </select>
          {errors.range && <p className="text-red-400 text-xs mt-1">{errors.range.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Power</label>
          <input {...register('power')} type="number" min="0" className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Accuracy</label>
          <input {...register('accuracy')} type="number" min="0" max="100" className="input-field" placeholder="100" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">PP *</label>
          <input {...register('pp')} type="number" min="1" className="input-field" placeholder="10" />
          {errors.pp && <p className="text-red-400 text-xs mt-1">{errors.pp.message}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Effect</label>
        <textarea {...register('effect')} className="input-field" rows="2" placeholder="Move effect description..." />
      </div>
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Strategy Note</label>
        <textarea {...register('strategyNote')} className="input-field" rows="2" placeholder="Combat strategy..." />
      </div>

      {/* Pokemon selection */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Pokémon Learned ({selectedPokemon.length})</label>
        <div className="max-h-40 overflow-y-auto bg-[#12121a] rounded-xl p-3 space-y-1">
          {allPokemon.map((p) => (
            <label key={p._id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPokemon.includes(p._id)}
                onChange={() => togglePokemon(p._id)}
                className="rounded border-gray-600 bg-[#0a0a0f] text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-300">{p.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
        {editData ? 'Update' : 'Create'} Move
      </button>
    </form>
  )
}

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'pokemon'
  const editId = searchParams.get('edit')
  const [pokemonList, setPokemonList] = useState([])
  const [movesList, setMovesList] = useState([])
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pokeRes, moveRes] = await Promise.all([
        api.get('/pokemon?limit=200'),
        api.get('/moves?limit=200'),
      ])
      setPokemonList(pokeRes.data.data.pokemon || pokeRes.data.data || [])
      setMovesList(moveRes.data.data.moves || moveRes.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (editId) {
      const fetchEdit = async () => {
        try {
          const endpoint = tab === 'pokemon' ? `/pokemon/${editId}` : `/moves/${editId}`
          const res = await api.get(endpoint)
          setEditData(res.data.data)
        } catch {
          toast.error('Item not found')
          setSearchParams({ tab })
        }
      }
      fetchEdit()
    } else {
      setEditData(null)
    }
  }, [editId, tab])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const endpoint = deleteTarget.type === 'pokemon' ? `/pokemon/${deleteTarget.id}` : `/moves/${deleteTarget.id}`
      await api.delete(endpoint)
      toast.success('Deleted!')
      setDeleteTarget(null)
      fetchData()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleSaved = () => {
    setSearchParams({ tab })
    setEditData(null)
    fetchData()
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-400" /> Admin Panel
        </h1>
        <p className="text-gray-400 mt-1">Manage Pokémon and Moves data</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2a2a4a] pb-0">
        <button
          onClick={() => { setSearchParams({ tab: 'pokemon' }); setEditData(null) }}
          className={`px-4 py-2 -mb-px border-b-2 transition-colors font-medium ${
            tab === 'pokemon' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />Pokémon
        </button>
        <button
          onClick={() => { setSearchParams({ tab: 'moves' }); setEditData(null) }}
          className={`px-4 py-2 -mb-px border-b-2 transition-colors font-medium ${
            tab === 'moves' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4 inline mr-2" />Moves
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {editData ? 'Edit' : 'Create'} {tab === 'pokemon' ? 'Pokémon' : 'Move'}
            </h2>
            {editData && (
              <button onClick={() => { setSearchParams({ tab }); setEditData(null) }} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {tab === 'pokemon' ? (
            <PokemonForm
              key={editData?._id || 'new'}
              editData={editData}
              onSaved={handleSaved}
              allMoves={movesList}
            />
          ) : (
            <MoveForm
              key={editData?._id || 'new'}
              editData={editData}
              onSaved={handleSaved}
              allPokemon={pokemonList}
            />
          )}
        </div>

        {/* List */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {tab === 'pokemon' ? `Pokémon (${pokemonList.length})` : `Moves (${movesList.length})`}
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {tab === 'pokemon' ? pokemonList.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-[#12121a]/50 hover:bg-[#12121a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0f0f1a] flex items-center justify-center overflow-hidden">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-6 h-6 object-contain" /> : <Zap className="w-4 h-4 text-gray-600" />}
                  </div>
                  <span className="text-white font-medium text-sm">{p.name}</span>
                  <TypeBadge type={p.primaryType} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setSearchParams({ tab: 'pokemon', edit: p._id })} className="p-1.5 rounded-lg hover:bg-indigo-600/30 text-gray-400 hover:text-indigo-400">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget({ id: p._id, type: 'pokemon' })} className="p-1.5 rounded-lg hover:bg-red-600/30 text-gray-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )) : movesList.map((m) => (
              <div key={m._id} className="flex items-center justify-between p-3 rounded-xl bg-[#12121a]/50 hover:bg-[#12121a] transition-colors">
                <div className="flex items-center gap-3">
                  <TypeBadge type={m.type} />
                  <span className="text-white font-medium text-sm">{m.name}</span>
                  <span className="text-xs text-gray-500">{m.category} • PWR:{m.power || '—'} • Range: {m.range || 'Đơn mục tiêu'}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setSearchParams({ tab: 'moves', edit: m._id })} className="p-1.5 rounded-lg hover:bg-indigo-600/30 text-gray-400 hover:text-indigo-400">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget({ id: m._id, type: 'moves' })} className="p-1.5 rounded-lg hover:bg-red-600/30 text-gray-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  )
}
