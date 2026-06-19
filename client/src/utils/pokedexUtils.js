// Type color palette matching PokeAPI type names (lowercase)
export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  unknown: '#68A090',
  shadow: '#604E82',
}

export const TYPE_VI = {
  normal: 'Thường',
  fire: 'Lửa',
  water: 'Nước',
  electric: 'Điện',
  grass: 'Cỏ',
  ice: 'Băng',
  fighting: 'Cách Đấu',
  poison: 'Độc',
  ground: 'Đất',
  flying: 'Bay',
  psychic: 'Siêu Năng',
  bug: 'Bọ',
  rock: 'Đá',
  ghost: 'Ma',
  dragon: 'Rồng',
  dark: 'Bóng Tối',
  steel: 'Thép',
  fairy: 'Tiên',
}

export const CATEGORY_VI = {
  physical: 'Vật Lý',
  special: 'Đặc Biệt',
  status: 'Trạng Thái',
}

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'Tấn Công',
  defense: 'Phòng Thủ',
  spAtk: 'Tấn Công ĐB',
  spDef: 'Phòng Thủ ĐB',
  speed: 'Tốc Độ',
}

export function getTypeColor(type) {
  return TYPE_COLORS[type?.toLowerCase()] || '#94a3b8'
}

export function getTypeVi(type) {
  return TYPE_VI[type?.toLowerCase()] || type || ''
}

export function getCategoryVi(cat) {
  return CATEGORY_VI[cat?.toLowerCase()] || cat || ''
}

export function formatName(name) {
  if (!name) return ''
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function getStatColor(value) {
  if (value < 50) return '#ef4444'
  if (value < 80) return '#f97316'
  if (value < 100) return '#eab308'
  if (value < 120) return '#22c55e'
  return '#06b6d4'
}

export function padId(id) {
  return String(id).padStart(3, '0')
}
