"use client"

/**
 * BLOCK: Confirm Screen (Dark Header Overlap)
 * Use for: transaction confirmation, review before submit, auth screens
 * Pattern: Dark header hero → White card overlap → Detail list → CTA
 * Reference: OKX bottom sheet / Revolut dark confirmation
 *
 * Copy this block, rename, customize details.
 */

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ConfirmScreen() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">

      {/* Dark header hero */}
      <div className="bg-foreground px-[22px] pt-[54px] pb-[60px] flex flex-col items-center">
        {/* Nav */}
        <div className="w-full flex items-center mb-[24px]">
          <button onClick={() => router.back()} className="p-[10px] -ml-[10px]">
            <ChevronLeft className="w-6 h-6 text-background" />
          </button>
          <span className="flex-1 text-center text-md font-semibold text-background">
            Confirm
          </span>
          <div className="w-[44px]" />
        </div>

        {/* Hero amount */}
        <span className="text-xl font-semibold text-background">500,000đ</span>
        <span className="text-sm text-background/60 mt-[4px]">Transaction amount</span>
      </div>

      {/* White card overlap */}
      <div className="flex-1 overflow-y-auto -mt-[32px] pb-[100px]">
        <div className="mx-[12px] bg-background rounded-28 px-[12px] py-[16px]">

          {/* Detail list */}
          <ItemList>
            <ItemListItem label="From" suffix={<span className="text-sm text-foreground-secondary">Main Wallet</span>} />
            <ItemListItem label="To" suffix={<span className="text-sm text-foreground-secondary">0912 345 678</span>} />
            <ItemListItem label="Fee" suffix={<span className="text-sm text-foreground-secondary">Free</span>} />
            <ItemListItem label="Total" suffix={<span className="text-sm text-foreground-secondary">500,000đ</span>} />
          </ItemList>

        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-secondary">
        <div className="px-[22px] pt-[12px] pb-[16px]">
          <ButtonGroup>
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button variant="primary" isLoading={loading} onClick={() => setLoading(true)}>
              Confirm
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>

    </div>
  )
}
