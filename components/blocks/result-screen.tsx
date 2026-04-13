"use client"

/**
 * BLOCK: Result Screen (Success/Failed)
 * Use for: transaction result, completion, feedback
 * Pattern: Dark header → FeedbackState → Detail card → Multi-CTA
 * Reference: Cash App (centered, minimal)
 *
 * Copy this block, rename, customize.
 */

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ItemList, ItemListItem } from "@/components/ui/item-list"

export default function ResultScreen() {
  const router = useRouter()
  const isSuccess = true // toggle for success/failed

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">

      {/* Dark header hero with icon */}
      <div className="bg-foreground px-[22px] pt-[54px] pb-[60px] flex flex-col items-center">
        {/* Status icon */}
        <div className={`w-[64px] h-[64px] rounded-full flex items-center justify-center mb-[16px] ${
          isSuccess ? "bg-success" : "bg-danger"
        }`}>
          {isSuccess
            ? <CheckCircle className="w-8 h-8 text-white" />
            : <XCircle className="w-8 h-8 text-white" />
          }
        </div>

        {/* Title */}
        <span className="text-xl font-semibold text-background">
          {isSuccess ? "Transaction Successful" : "Transaction Failed"}
        </span>
        <span className="text-sm text-background/60 mt-[4px]">
          {isSuccess ? "Your transfer has been completed" : "Please try again later"}
        </span>
      </div>

      {/* White card overlap with details */}
      <div className="flex-1 overflow-y-auto -mt-[32px] pb-[100px]">
        <div className="mx-[12px] bg-background rounded-28 px-[12px] py-[16px]">

          <ItemList>
            <ItemListItem label="Amount" suffix={<span className="text-sm text-foreground-secondary">500,000đ</span>} />
            <ItemListItem label="To" suffix={<span className="text-sm text-foreground-secondary">0912 345 678</span>} />
            <ItemListItem label="Date" suffix={<span className="text-sm text-foreground-secondary">11/04/2026 12:30</span>} />
            <ItemListItem label="Ref" suffix={<span className="text-sm text-foreground-secondary">TXN-123456</span>} />
          </ItemList>

        </div>
      </div>

      {/* Fixed bottom multi-CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-secondary">
        <div className="px-[22px] pt-[12px] pb-[16px] flex flex-col gap-[8px]">
          {isSuccess ? (
            <>
              <Button variant="primary" className="w-full" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button variant="secondary" className="w-full">
                New Transaction
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" className="w-full" onClick={() => router.back()}>
                Try Again
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </>
          )}
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>

    </div>
  )
}
