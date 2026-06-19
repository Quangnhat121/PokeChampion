import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Existing pages
import Dashboard from './pages/Dashboard'
import PokemonList from './pages/PokemonList'
import PokemonDetail from './pages/PokemonDetail'
import MovesList from './pages/MovesList'
import MoveDetail from './pages/MoveDetail'
import TypeChart from './pages/TypeChart'
import TeamBuilder from './pages/TeamBuilder'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

// Pokedex pages (PokeAPI realtime)
import PokedexPokemonList from './pages/pokedex/PokedexPokemonList'
import PokedexPokemonDetail from './pages/pokedex/PokedexPokemonDetail'
import PokedexMovesList from './pages/pokedex/PokedexMovesList'
import PokedexMoveDetail from './pages/pokedex/PokedexMoveDetail'
import PokedexTypeList from './pages/pokedex/PokedexTypeList'
import PokedexTypeDetail from './pages/pokedex/PokedexTypeDetail'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function AuthPage({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  useEffect(() => { checkAuth() }, [])

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<AuthPage><Login /></AuthPage>} />
      <Route path="/register" element={<AuthPage><Register /></AuthPage>} />

      {/* Main */}
      <Route path="/" element={<Layout><Dashboard /></Layout>} />

      {/* Old Pokemon/Moves (MongoDB) */}
      <Route path="/pokemon" element={<Layout><PokemonList /></Layout>} />
      <Route path="/pokemon/:id" element={<Layout><PokemonDetail /></Layout>} />
      <Route path="/moves" element={<Layout><MovesList /></Layout>} />
      <Route path="/moves/:id" element={<Layout><MoveDetail /></Layout>} />
      <Route path="/type-chart" element={<Layout><TypeChart /></Layout>} />

      {/* ─── Pokedex (PokeAPI Realtime) ─── */}
      <Route path="/pokedex/pokemon" element={<Layout><PokedexPokemonList /></Layout>} />
      <Route path="/pokedex/pokemon/:nameOrId" element={<Layout><PokedexPokemonDetail /></Layout>} />
      <Route path="/pokedex/moves" element={<Layout><PokedexMovesList /></Layout>} />
      <Route path="/pokedex/moves/:nameOrId" element={<Layout><PokedexMoveDetail /></Layout>} />
      <Route path="/pokedex/types" element={<Layout><PokedexTypeList /></Layout>} />
      <Route path="/pokedex/types/:nameOrId" element={<Layout><PokedexTypeDetail /></Layout>} />

      {/* Protected */}
      <Route path="/team-builder" element={<ProtectedRoute><Layout><TeamBuilder /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Layout><Admin /></Layout></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
