import api from './api'

const pokemonService = {
  getAll: async (params = {}) => {
    const response = await api.get('/pokemon', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/pokemon/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/pokemon', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/pokemon/${id}`, data)
    return response.data
  },

  remove: async (id) => {
    const response = await api.delete(`/pokemon/${id}`)
    return response.data
  },
}

export default pokemonService
