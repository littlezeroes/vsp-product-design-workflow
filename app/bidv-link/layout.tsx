import { Suspense } from "react"

export default function BidvLinkLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[390px] min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  )
}
