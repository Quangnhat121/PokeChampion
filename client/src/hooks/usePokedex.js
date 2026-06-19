import { useState, useEffect, useCallback } from 'react'
import pokedexService from '../services/pokedexService'

export function usePokemonList(initialParams = {}) {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params, setParams] = useState({ page: 1, limit: 20, ...initialParams })

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await pokedexService.getPokemonList(params)
      setData(res.data.pokemon || [])
      setPagination(res.data.pagination)
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  return { data, pagination, loading, error, params, setParams, refetch: fetch }
}

export function usePokemonDetail(nameOrId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!nameOrId) return
    setLoading(true)
    setError(null)
    pokedexService.getPokemonDetail(nameOrId)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.response?.data?.message || 'Không tìm thấy Pokémon'))
      .finally(() => setLoading(false))
  }, [nameOrId])

  return { data, loading, error }
}

export function useMoveList(initialParams = {}) {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params, setParams] = useState({ page: 1, limit: 20, ...initialParams })

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await pokedexService.getMoveList(params)
      setData(res.data.moves || [])
      setPagination(res.data.pagination)
    } catch (e) {
      setError(e.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  return { data, pagination, loading, error, params, setParams, refetch: fetch }
}

export function useMoveDetail(nameOrId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!nameOrId) return
    setLoading(true)
    setError(null)
    pokedexService.getMoveDetail(nameOrId)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.response?.data?.message || 'Không tìm thấy chiêu thức'))
      .finally(() => setLoading(false))
  }, [nameOrId])

  return { data, loading, error }
}

export function useTypeList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    pokedexService.getTypeList()
      .then((res) => setData(res.data || []))
      .catch((e) => setError(e.response?.data?.message || 'Không thể tải dữ liệu'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function useTypeDetail(nameOrId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!nameOrId) return
    setLoading(true)
    setError(null)
    pokedexService.getTypeDetail(nameOrId)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.response?.data?.message || 'Không tìm thấy hệ'))
      .finally(() => setLoading(false))
  }, [nameOrId])

  return { data, loading, error }
}
