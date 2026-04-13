"use client"

/**
 * BLOCK: Form Screen
 * Use for: input screens, registration, data entry
 * Pattern: Header → Form fields → Validation → CTA bottom
 * Reference: Cash App (single focus per screen)
 *
 * Copy this block, rename, customize fields.
 * DO NOT import this file — copy the code.
 */

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"
import { InformMessage } from "@/components/ui/inform-message"

export default function FormScreen() {
  const router = useRouter()
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const isValid = value.length >= 10
  const handleSubmit = () => {
    if (!isValid) return
    setLoading(true)
    // → navigate to next screen
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

      {/* Header */}
      <Header
        variant="large-title"
        largeTitle="Screen Title"
        leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[100px]">

        {/* Section: Form */}
        <div className="pt-[24px]">
          <div className="px-[22px] flex flex-col gap-[12px]">
            <TextField
              label="Field Label"
              placeholder="Enter value..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(null)
              }}
              error={error ?? undefined}
            />
          </div>
        </div>

        {/* Optional: Info banner */}
        {/*
        <div className="pt-[16px] px-[22px]">
          <InformMessage variant="info">
            Helper text or important note
          </InformMessage>
        </div>
        */}

      </div>

      {/* Fixed bottom CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-background">
        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button
            variant="primary"
            className="w-full"
            disabled={!isValid}
            isLoading={loading}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
        {/* Home indicator */}
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>

    </div>
  )
}
