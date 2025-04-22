"use client"

import { useWalletClient, usePublicClient } from "wagmi"
import { useState } from "react"
import { getContractConfig } from "@/lib/contracts/LandRegistry"
import { toast } from "sonner"

interface SwapFormProps {
  myLands?: string[]
  swappableLands?: string[]
  refetch?: () => void
}

export function SwapForm({ myLands = [], swappableLands = [], refetch }: SwapFormProps) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const [you, setYou] = useState("")
  const [them, setThem] = useState("")
  const [loading, setLoading] = useState(false)

  const swap = async () => {
    if (!walletClient || !publicClient) return

    try {
      setLoading(true)

      const txHash = await walletClient.writeContract({
        ...getContractConfig,
        functionName: "swapLand",
        args: [you.trim(), them.trim()],
      })

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success("Swap Successfull!")
      refetch?.()
    } catch (err) {
      console.error("Swap error:", err)
      toast.error("Error while swapping")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">🔑 Your Land</label>
      <select
        className="input w-full"
        value={you}
        onChange={(e) => setYou(e.target.value)}
      >
        <option value="">-- Select your land --</option>
        {myLands.map((land) => (
          <option key={land} value={land}>
            {land}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium">🌍 Available to Swap</label>
      <select
        className="input w-full"
        value={them}
        onChange={(e) => setThem(e.target.value)}
      >
        <option value="">-- Select land to swap with --</option>
        {swappableLands.map((land) => (
          <option key={land} value={land}>
            {land}
          </option>
        ))}
      </select>

      <button
        className="btn-primary w-full"
        onClick={swap}
        disabled={loading || !you || !them}
      >
        {loading ? "⏳ Swapping..." : "Swap Lands"}
      </button>
    </div>
  )
}
