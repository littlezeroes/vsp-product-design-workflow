"use client"

import { useRouter } from "next/navigation"

export default function BidvLinkEntry() {
  const router = useRouter()
  // Redirect to bank list as entry point
  router.replace("/bidv-link/bank-list")
  return null
}
