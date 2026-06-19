import api from './api'

const pokedexService = {
  // Pokemon
  getPokemonList: (params = {}) =>
    api.get('/pokedex/pokemon', { params }).then((r) => r.data),
  getPokemonDetail: (nameOrId) =>
    api.get(`/pokedex/pokemon/${nameOrId}`).then((r) => r.data),

  // Moves
  getMoveList: (params = {}) =>
    api.get('/pokedex/moves', { params }).then((r) => r.data),
  getMoveDetail: (nameOrId) =>
    api.get(`/pokedex/moves/${nameOrId}`).then((r) => r.data),

  // Types
  getTypeList: () => api.get('/pokedex/types').then((r) => r.data),
  getTypeDetail: (nameOrId) =>
    api.get(`/pokedex/types/${nameOrId}`).then((r) => r.data),

  // Abilities
  getAbilityDetail: (nameOrId) =>
    api.get(`/pokedex/abilities/${nameOrId}`).then((r) => r.data),
}

export default pokedexService
