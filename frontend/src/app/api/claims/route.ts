import { IRON_OPTIONS } from "@/lib/config/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { parseAbiItem } from "viem"
import { publicClient } from "../../contract/client"
import { getContractConfig } from "@/lib/contracts/LandRegistry"

export async function GET(request: NextRequest) {
  try {

    const session = await getIronSession<{ nonce: string }>(
    await cookies(),
      IRON_OPTIONS
    )

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const url = request.nextUrl
    const address = url.searchParams.get("address")
    if (!address) {
      return NextResponse.json({ message: "Missing address param" }, { status: 400 })
    }

    const latestBlock = await publicClient.getBlockNumber()
    const blockLookback = 5000n
    const fromBlock = latestBlock > blockLookback ? latestBlock - blockLookback : 0n

    const logs = await publicClient.getLogs({
      ...getContractConfig,
      event: parseAbiItem("event LandClaimed(address indexed user, string w3wName)"),
      fromBlock,
      toBlock: latestBlock,
    })

    // Extract & filter
    const uniqueNames = new Set<string>()
    const recent = []

    for (const log of logs.reverse()) {
      const w3wName = log.args.w3wName as string
      const user = log.args.user as string

      if (user.toLowerCase() === address.toLowerCase()) continue
      if (uniqueNames.has(w3wName)) continue

      uniqueNames.add(w3wName)
      recent.push({ w3wName, user })

      if (recent.length >= 20) break
    }

    return NextResponse.json({ total: recent.length, claims: recent })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
