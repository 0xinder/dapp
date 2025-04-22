// lib/hooks/useSwappableLands.ts
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

type Claim = {
  w3wName: string
  user: string
}

type ResponseData = {
  claims: Claim[]
}

export function useSwappableLands() {
  const { address } = useAccount()
  const [lands, setLands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/claims?address=${address}`)
        const data: ResponseData = await res.json()
        
        const filtered = data.claims.filter(
          (claim) => claim?.user?.toLowerCase() !== address?.toLowerCase()
        )

        const unique = Array.from(new Set(filtered.map((c) => c.w3wName)))
        setLands(unique)
      } catch (err) {
        console.error("Failed to load swappable lands", err)
        setLands([]) // fallback in error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [address])

  return { lands, loading }
}
