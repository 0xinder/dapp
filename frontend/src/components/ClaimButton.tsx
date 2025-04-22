"use client"

import { useWalletClient, usePublicClient } from "wagmi"
import { useState } from "react"
import { getContractConfig } from "@/lib/contracts/LandRegistry"
import { toast } from "sonner"

export function ClaimButton({ w3wName, refetch }: { w3wName: string, refetch?: () => void }) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)

  const claim = async () => {

    if (!walletClient || !publicClient) {
      toast.error("Wallet or network client not ready")
      return
    }

    try {
      setLoading(true)

      // ✅ Check if land is already claimed
      const owner = await publicClient.readContract({
        ...getContractConfig,
        functionName: "getLandOwner",
        args: [w3wName],
      })

      if (owner && owner !== "0x0000000000000000000000000000000000000000") {
        toast.error("This land is already claimed.")
        return
      }

      // Send transaction and get tx hash
      const txHash = await walletClient.writeContract({
        ...getContractConfig,
        functionName: "claimLand",
        args: [w3wName],
      })

      // Wait for it to be mined
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success("Land Claimed Successfully!")
      refetch?.() // 🔁 Refetch lands after successful claim
    } catch (err) {
      toast.error("Error claiming land")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn-primary" onClick={claim} disabled={loading}>
      {loading ? "⏳ Claiming..." : `Claim ${w3wName}`}
    </button>
  )
}
