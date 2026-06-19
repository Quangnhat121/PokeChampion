import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  Swords,
  Grid3X3,
  Users,
  Shield,
  LogOut,
  X,
  ChevronRight,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pokemon', label: 'Pokémon (DB)', icon: Zap },
  { path: '/moves', label: 'Moves (DB)', icon: Swords },
  { path: '/type-chart', label: 'Type Chart', icon: Grid3X3 },
  { path: '/team-builder', label: 'Team Builder', icon: Users },
]

const pokedexItems = [
  { path: '/pokedex/pokemon', label: 'Pokédex' },
  { path: '/pokedex/moves', label: 'Chiêu Thức' },
  { path: '/pokedex/types', label: 'Bảng Hệ' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAuthenticated } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const navigate = useNavigate()
  const [pokedexOpen, setPokedexOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 glass-sidebar z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <div className="w-4 h-4 rounded-full bg-white/90 border-2 border-white/50 relative">
                <div className="absolute inset-0 border-t-2 border-white/80 rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Pokédex</h1>
              <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest -mt-0.5">Champion</p>
            </div>
          </NavLink>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {/* Main nav */}
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400/50" />}
                </>
              )}
            </NavLink>
          ))}

          {/* PokeAPI Section */}
          <div className="pt-3">
            <button
              onClick={() => setPokedexOpen((o) => !o)}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors"
            >
              <Globe size={12} />
              <span>PokeAPI · Realtime</span>
              {pokedexOpen ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
            </button>

            {pokedexOpen && (
              <div className="space-y-0.5 mt-1">
                {pokedexItems.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 pl-8 pr-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isActive ? '#34d399' : '#4b5563' }} />
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Admin nav */}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Shield size={18} className={isActive ? 'text-red-400' : 'text-gray-500 group-hover:text-gray-300'} />
                  <span>Admin</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-red-400/50" />}
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#2a2a4a]">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <NavLink to="/login" onClick={onClose} className="btn-primary w-full text-center block text-sm">
              Đăng nhập
            </NavLink>
          )}
        </div>
      </aside>
    </>
  )
}
