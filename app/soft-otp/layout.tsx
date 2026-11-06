import { Suspense } from "react"

export default function SoftOtpLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>
}
