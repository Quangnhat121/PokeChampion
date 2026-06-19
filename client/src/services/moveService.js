import api from './api'

const moveService = {
  getAll: async (params = {}) => {
    const response = await api.get('/moves', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/moves/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/moves', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/moves/${id}`, data)
    return response.data
  },

  remove: async (id) => {
    const response = await api.delete(`/moves/${id}`)
    return response.data
  },
}

export default moveService
