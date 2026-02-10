import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import useWidgetData from './use-widget-data'

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity
      }
    }
  })

  return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useWidgetData', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    const { result } = renderHook(() => useWidgetData('github', 'https://api.example.com/github'), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.hasFatalError).toBe(false)
  })

  it('returns data on successful fetch', async () => {
    const mockData = { payload: { user: { name: 'Test User' } } }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useWidgetData('github', 'https://api.example.com/github'), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData.payload)
    expect(result.current.hasFatalError).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })

  it('returns error state on failed fetch', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const { result } = renderHook(() => useWidgetData('github', 'https://api.example.com/github'), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.hasFatalError).toBe(true)
    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeDefined()
  })

  it('does not fetch when dataSource is not provided', () => {
    const { result } = renderHook(() => useWidgetData('github', ''), {
      wrapper: createWrapper()
    })

    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })

  it('handles data without payload wrapper', async () => {
    const mockData = { user: { name: 'Test User' } }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useWidgetData('github', 'https://api.example.com/github'), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should return data directly if no payload wrapper
    expect(result.current.data).toEqual(mockData)
  })

  it('exposes refetch function', async () => {
    const mockData = { payload: { count: 1 } }
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { result } = renderHook(() => useWidgetData('github', 'https://api.example.com/github'), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.refetch).toBe('function')
  })
})
