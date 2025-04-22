import { IRON_OPTIONS } from "@/lib/config/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { publicClient } from "../../contract/client"
import abi from "../../contract/abi.json"
import { CONTRACT_ADDRESS } from "@/lib/constants"

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
    const wallet = url.searchParams.get("address")
    const lands: any = await publicClient.readContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: "getLandsOf",
      args: [wallet],
    })
    
    return NextResponse.json({ totalLands: lands.length, lands})
} catch (e: any) {
  return NextResponse.json({ error: e.message }, { status: 400 })
}}
