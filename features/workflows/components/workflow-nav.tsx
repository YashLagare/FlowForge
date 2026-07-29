"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusIcon, WorkflowIcon, Sparkles } from "lucide-react"

import { generateSlug } from "@/features/workflows/lib/generate-slug"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Workflow } from "@/lib/db/schema"

interface WorkflowNavProps {
  workflows: Workflow[]
  onCreateWorkflow: (name: string) => Promise<void>
  isPro?: boolean
}

export function WorkflowNav({ workflows, onCreateWorkflow, isPro = false }: WorkflowNavProps) {
  const { state } = useSidebar()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const handleCreateWorkflow = () => {
    if (!isPro && workflows.length >= 2) {
      setShowUpgradeDialog(true)
      return
    }

    startTransition(async () => {
      await onCreateWorkflow(generateSlug())
    })
  }

  const upgradeDialog = (
    <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Workflow Limit Reached
          </DialogTitle>
          <DialogDescription>
            You have reached the maximum of 2 workflows on the Free plan. Upgrade to Pro to unlock unlimited workflows, premium AI nodes, and team collaboration.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild className="w-full">
            <Link href="/billing">Unlock Pro</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const workflowItems = workflows.map((workflow) => (
    <SidebarMenuItem key={workflow.id}>
      <SidebarMenuButton
        asChild
        isActive={pathname === `/workflows/${workflow.id}`}
      >
        <Link href={`/workflows/${workflow.id}`}>
          <span>{workflow.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))

  if (state === "collapsed") {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarMenuButton tooltip="Workflows">
                    <WorkflowIcon />
                    <span>Workflows</span>
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent side="right" align="start" className="p-1">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleCreateWorkflow}
                        disabled={isPending}
                      >
                        <PlusIcon />
                        <span>New workflow</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                  <SidebarSeparator className="mx-0" />
                  <SidebarMenu className="gap-y-0.5">{workflowItems}</SidebarMenu>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        {upgradeDialog}
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarGroupAction
        title="New workflow"
        onClick={handleCreateWorkflow}
        disabled={isPending}
      >
        <PlusIcon />
        <span className="sr-only">New workflow</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu className="gap-y-0.5">{workflowItems}</SidebarMenu>
      </SidebarGroupContent>
      {upgradeDialog}
    </SidebarGroup>
  )
}
