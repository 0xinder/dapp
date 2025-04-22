"use client"

import { useWalletClient, usePublicClient } from "wagmi"
import { useState } from "react"
import { getContractConfig } from "@/lib/contracts/LandRegistry"
import { toast } from "sonner"

export function DeleteAccountButton({
  refetch,
}: {
  refetch?: () => void
}) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)

  const deleteUser = async () => {
    if (!walletClient || !publicClient) return

    try {
      setLoading(true)

      const txHash = await walletClient.writeContract({
        ...getContractConfig,
        functionName: "deleteUser",
        args: [walletClient.account.address], // 👈 Now just pass address
      })

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success("Deleted acquired lands")
      refetch?.()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete lands")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={deleteUser} className="btn-danger" disabled={loading}>
      {loading ? "Deleting..." : "Delete My Account"}
    </button>
  )
}
