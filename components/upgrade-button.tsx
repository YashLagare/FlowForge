"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function UpgradeButton() {
  const router = useRouter()

  return (
    <Button
      size="sm"
      className="w-full font-medium"
      onClick={() => router.push("/billing")}
    >
      View Plans
    </Button>
  )
}
