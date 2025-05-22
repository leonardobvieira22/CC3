"use client"

import type { ReactNode } from "react"

interface ClientBodyProps {
  children: ReactNode
}

export function ClientBody({ children }: ClientBodyProps) {
  return <>{children}</>
}
