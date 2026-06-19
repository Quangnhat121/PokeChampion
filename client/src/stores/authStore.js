import { create } from 'zustand'
import authService from '../services/authService'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  get isAdmin() {
    return get().user?.role === 'admin'
  },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const data = await authService.login(email, password)
      const token = data.token || data.data?.token
      const user = data.user || data.data?.user || data.data
      localStorage.setItem('token', token)
      set({ user, token, isAuthenticated: true, isLoading: false })
      return data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true })
    try {
      const data = await authService.register(username, email, password)
      const token = data.token || data.data?.token
      const user = data.user || data.data?.user || data.data
      if (token) {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
      return data
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = get().token
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return
    }
    set({ isLoading: true })
    try {
      const data = await authService.getMe()
      const user = data.user || data.data?.user || data.data || data
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
