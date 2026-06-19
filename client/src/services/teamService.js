import api from './api'

const teamService = {
  getAll: async () => {
    const response = await api.get('/teams')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/teams/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/teams', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/teams/${id}`, data)
    return response.data
  },

  remove: async (id) => {
    const response = await api.delete(`/teams/${id}`)
    return response.data
  },
}

export default teamService
