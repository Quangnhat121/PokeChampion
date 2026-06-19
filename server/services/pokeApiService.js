import axios from 'axios';
import cacheService from './cacheService.js';

const POKEAPI = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: POKEAPI,
  timeout: 15000,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cacheKey(resource, id) {
  return `pokeapi:${resource}:${id}`;
}

async function cachedGet(resource, idOrUrl) {
  const key = cacheKey(resource, idOrUrl);
  const cached = cacheService.get(key);
  if (cached) return cached;

  const url = idOrUrl.startsWith('http') ? idOrUrl : `/${resource}/${idOrUrl}`;
  const { data } = idOrUrl.startsWith('http')
    ? await axios.get(idOrUrl, { timeout: 15000 })
    : await api.get(url);

  cacheService.set(key, data);
  return data;
}

// ─── Pokemon ──────────────────────────────────────────────────────────────────

/**
 * Get paginated pokemon list.
 */
async function getPokemonList(offset = 0, limit = 20) {
  const key = `pokeapi:pokemon-list:${offset}:${limit}`;
  const cached = cacheService.get(key);
  if (cached) return cached;

  const { data } = await api.get(`/pokemon?offset=${offset}&limit=${limit}`);
  cacheService.set(key, data);
  return data;
}

/**
 * Get full pokemon details by name or id.
 */
async function getPokemonDetail(nameOrId) {
  return cachedGet('pokemon', String(nameOrId).toLowerCase());
}

/**
 * Get pokemon species (for flavor text, descriptions).
 */
async function getPokemonSpecies(nameOrId) {
  return cachedGet('pokemon-species', String(nameOrId).toLowerCase());
}

// ─── Moves ────────────────────────────────────────────────────────────────────

async function getMoveList(offset = 0, limit = 20) {
  const key = `pokeapi:move-list:${offset}:${limit}`;
  const cached = cacheService.get(key);
  if (cached) return cached;

  const { data } = await api.get(`/move?offset=${offset}&limit=${limit}`);
  cacheService.set(key, data);
  return data;
}

async function getMoveDetail(nameOrId) {
  return cachedGet('move', String(nameOrId).toLowerCase());
}

// ─── Types ────────────────────────────────────────────────────────────────────

async function getTypeList() {
  const key = 'pokeapi:type-list';
  const cached = cacheService.get(key);
  if (cached) return cached;

  const { data } = await api.get('/type');
  cacheService.set(key, data);
  return data;
}

async function getTypeDetail(nameOrId) {
  return cachedGet('type', String(nameOrId).toLowerCase());
}

// ─── Abilities ────────────────────────────────────────────────────────────────

async function getAbilityDetail(nameOrId) {
  return cachedGet('ability', String(nameOrId).toLowerCase());
}

// ─── All Pokemon names (for search) ──────────────────────────────────────────

async function getAllPokemonNames() {
  const key = 'pokeapi:all-pokemon-names';
  const cached = cacheService.get(key);
  if (cached) return cached;

  const { data } = await api.get('/pokemon?limit=1302');
  const names = data.results.map((p) => p.name);
  cacheService.set(key, names);
  return names;
}

// ─── All Move names (for search) ─────────────────────────────────────────────

async function getAllMoveNames() {
  const key = 'pokeapi:all-move-names';
  const cached = cacheService.get(key);
  if (cached) return cached;

  const { data } = await api.get('/move?limit=1000');
  const names = data.results;
  cacheService.set(key, names);
  return names;
}

const pokeApiService = {
  getPokemonList,
  getPokemonDetail,
  getPokemonSpecies,
  getMoveList,
  getMoveDetail,
  getTypeList,
  getTypeDetail,
  getAbilityDetail,
  getAllPokemonNames,
  getAllMoveNames,
};

export default pokeApiService;
