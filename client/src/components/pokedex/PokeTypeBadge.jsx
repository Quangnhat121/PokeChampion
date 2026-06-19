import { getTypeColor, getTypeVi } from '../../utils/pokedexUtils'

export default function PokeTypeBadge({ type, showVi = false, size = 'sm' }) {
  if (!type) return null
  const color = getTypeColor(type)
  const label = showVi ? getTypeVi(type) : type.toUpperCase()

  const sizeClass = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base',
  }[size] || 'px-3 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider text-white ${sizeClass}`}
      style={{ backgroundColor: color, boxShadow: `0 2px 8px ${color}50` }}
    >
      {label}
    </span>
  )
}
