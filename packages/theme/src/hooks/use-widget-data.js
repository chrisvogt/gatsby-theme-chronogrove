import { useQuery } from '@tanstack/react-query'

/**
 * Fetcher function for widget data
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<any>} The fetched data
 */
const fetchWidgetData = async url => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  // The API returns data wrapped in a payload object
  return data.payload ?? data
}

/**
 * Custom hook for fetching widget data using TanStack Query
 *
 * This hook provides a consistent interface for all widgets to fetch their data,
 * with built-in caching, loading states, and error handling.
 *
 * @param {string} widgetId - Unique identifier for the widget (e.g., 'github', 'spotify')
 * @param {string} dataSource - The URL to fetch widget data from
 * @param {Object} options - Additional options to pass to useQuery
 * @returns {Object} Query result with data, isLoading, isError, and error
 *
 * @example
 * const { data, isLoading, isError } = useWidgetData('github', 'https://api.example.com/github')
 */
const useWidgetData = (widgetId, dataSource, options = {}) => {
  const query = useQuery({
    queryKey: ['widget', widgetId, dataSource],
    queryFn: () => fetchWidgetData(dataSource),
    // Only fetch if we have a valid data source
    enabled: Boolean(dataSource),
    ...options
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    // Alias for backwards compatibility with existing widget code
    hasFatalError: query.isError,
    // Additional useful properties from TanStack Query
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch
  }
}

export default useWidgetData
