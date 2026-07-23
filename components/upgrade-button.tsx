"use client"

import * as React from "react"
import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function UpgradeButton() {
  const clerk = useClerk()

  return (
    <Button
      size="sm"
      className="w-full font-medium"
      onClick={() => clerk.openOrganizationProfile()}
    >
      View Plans
    </Button>
  )
}
