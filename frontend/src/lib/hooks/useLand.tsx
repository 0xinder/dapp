"use client"

import { useAccount } from "wagmi"
import { useQuery } from "@tanstack/react-query"

export function useUserLands() {
  const { address } = useAccount()

  const fetchLands = async (): Promise<string[]> => {
    if (!address) return []
    const res = await fetch(`/api/lands?address=${address}`)
    if (!res.ok) throw new Error("Failed to fetch lands")
    const data = await res.json()
    return data.lands
  }

  const {
    data: lands = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["userLands", address],
    queryFn: fetchLands,
    enabled: !!address
  })

  return {
    lands,
    loading: isLoading,
    error: isError,
    refetch
  }
}
