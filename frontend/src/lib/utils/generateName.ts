import { keccak256, toBytes } from "viem"

const words = [
  "apple", "banana", "carrot", "delta", "echo", "falcon", "grape", "hazel",
  "igloo", "jungle", "kiwi", "lemon", "mango", "nutmeg", "olive", "peach",
  "quartz", "raspberry", "sugar", "tiger", "umbrella", "violet", "walrus",
  "xenon", "yam", "zebra"
]

export function generateName(lat: number, lng: number): string {
  const input = `${lat.toFixed(5)},${lng.toFixed(5)}`
  const hash = keccak256(toBytes(input))

  const index1 = parseInt(hash.slice(2, 10), 16) % words.length
  const index2 = parseInt(hash.slice(10, 18), 16) % words.length
  const index3 = parseInt(hash.slice(18, 26), 16) % words.length

  return `${words[index1]}.${words[index2]}.${words[index3]}`
}
