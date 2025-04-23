import { useState, useEffect, useCallback } from "react"
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios"
import axiosInstance from "@/lib/axios" // Asegúrate de tener una instancia base aquí

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useGet<T = any>(
  url: string,
  config?: AxiosRequestConfig,
  immediate: boolean = true
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null })

    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, config)
      setState({ data: response.data, loading: false, error: null })
    } catch (err) {
      const error = err as AxiosError
      setState({ data: null, loading: false, error: error.message })
    }
  }, [url, config])

  useEffect(() => {
    if (immediate) fetch()
  }, [fetch, immediate])

  return { ...state, fetch }
}

export function usePost<T = any, D = any>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const post = useCallback(
    async (url: string, body: D, config?: AxiosRequestConfig) => {
      setState({ data: null, loading: true, error: null })

      try {
        const response: AxiosResponse<T> = await axiosInstance.post(url, body, config)
        setState({ data: response.data, loading: false, error: null })
        return response.data
      } catch (err) {
        const error = err as AxiosError
        setState({ data: null, loading: false, error: error.message })
        throw error
      }
    },
    []
  )

  return { ...state, post }
}
