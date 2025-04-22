"use client"
import { useGeoLocation } from "@/lib/hooks/useGeoLocation"
import dynamic from "next/dynamic"
import { ClaimButton } from "@/components/ClaimButton"
import { LandList } from "@/components/LandList"
import { SwapForm } from "@/components/SwapForm"
import { DeleteAccountButton } from "@/components/DeleteAccountButton"
import { useUserLands } from "@/lib/hooks/useLand"
import { generateName } from "@/lib/utils/generateName"
import { useSwappableLands } from "@/lib/hooks/useSwapableLands"

// Dynamically load LandMap with SSR disabled
const LandMap = dynamic(() => import("@/components/LandMap").then(mod => mod.default), {
  ssr: false,
  loading: () => <p>🗺️ Loading map...</p>,
})

export default function Home() {
  const { location, error, load } = useGeoLocation()
  const { lands: myLands, loading: landsLoading, refetch } = useUserLands()
  const { lands: swappableLands } = useSwappableLands()


  return (
    <div className="grid max-h-screen items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="flex flex-col items-center justify-center gap-8 w-full max-w-xl">
        <div className="text-center font-mono text-2xl font-bold">
          <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Coordinates
          </span>
        </div>

        {load && <p>📡 Getting your location...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}

        {location && (
          <>
            <p className="font-mono text-lg">
              Lat: {location.lat} | Lng: {location.lng}
            </p>
            <LandMap lat={location.lat} lng={location.lng} />
            <ClaimButton w3wName={generateName(location.lat, location.lng)} refetch={refetch} />
          </>
        )}


        <hr className="border w-full" />

        <section className="w-full space-y-4">
          <h2 className="text-xl font-bold">📋 Your Claimed Lands</h2>
          <LandList lands={myLands} refetch={refetch}/>
        </section>
        <hr className="border w-full" />

        <section className="w-full space-y-4">
          <h2 className="text-xl font-bold">🔁 Swap Land</h2>
          <SwapForm myLands={myLands} swappableLands={swappableLands} refetch={refetch} />
          </section>
        <hr className="border w-full" />

        <section className="w-full space-y-4 pb-4">
          <h2 className="text-xl font-bold text-red-600">🧹 Delete Account</h2>
          <DeleteAccountButton refetch={refetch}/>
        </section>
      </main>
    </div>
  )
}
