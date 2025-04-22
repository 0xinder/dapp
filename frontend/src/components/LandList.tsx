"use client"

import { useWalletClient, usePublicClient } from "wagmi"
import { useState } from "react"
import { getContractConfig } from "@/lib/contracts/LandRegistry"
import { toast } from "sonner"

export function LandList({ lands, refetch }: { lands: string[], refetch?: () => void }) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState("")

  const release = async (w3w: string) => {
    if (!walletClient || !publicClient) {
      toast.error("Wallet or network client not ready")
      return
    }

    try {
      setLoading(w3w)

      const txHash = await walletClient.writeContract({
        ...getContractConfig,
        functionName: "releaseLand",
        args: [w3w],
      })

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success(`Released: ${w3w}`)
      refetch?.() // 🔁 Refetch lands after successful claim
    } catch (err) {
      toast.error(`Error releasing ${w3w}`)
    } finally {
      setLoading("")
    }
  }

  return (
    <div className="space-y-4">
      {lands.map((w3w) => (
        <div key={w3w} className="flex items-center justify-between border p-2 rounded">
          <span className="font-mono">{w3w}</span>
          <button
            onClick={() => release(w3w)}
            disabled={loading === w3w}
            className="btn-secondary"
          >
            {loading === w3w ? "⏳ Releasing..." : "Release"}
          </button>
        </div>
      ))}
    </div>
  )
}
