import { getTypeColor } from '../../utils/typeData'

export default function TypeBadge({ type, size = 'sm', className = '' }) {
  if (!type) return null

  const color = getTypeColor(type)
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider text-white shadow-lg ${sizeClasses[size] || sizeClasses.sm} ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 2px 8px ${color}40`,
      }}
    >
      {type}
    </span>
  )
}
