import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export function useCapabilities() {
  return useQuery({
    queryKey: ['capabilities'],
    queryFn: api.capabilities,
    staleTime: 5 * 60_000,
  })
}

export function useAsk() {
  return {
    ask: api.ask,
  }
}
