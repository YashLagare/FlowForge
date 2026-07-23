import * as React from "react"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UpgradeButton } from "@/components/upgrade-button"
import { createWorkflowAction } from "@/features/workflows/actions"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"
import { listWorkflows } from "@/features/workflows/data"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { orgId, has } = await auth()
  const workflows = orgId ? await listWorkflows(orgId) : []
  const isPro = has({ plan: "pro" })

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          hidePersonal
          appearance={{
            elements: {
              rootBox: "min-w-0 group-data-[collapsible=icon]:!hidden",
              organizationSwitcherTrigger: "w-full justify-between",
            },
          }}
        />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <WorkflowNav
          workflows={workflows}
          onCreateWorkflow={createWorkflowAction}
        />
        {!isPro && (
          <div className="mt-auto p-4 group-data-[collapsible=icon]:hidden">
            <Card className="border-primary/20 bg-primary/5 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Upgrade to Pro
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Unlock advanced AI agent nodes, session replays, unlimited workflows, and real-time collaboration with your team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <UpgradeButton />
              </CardContent>
            </Card>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:items-center">
        <div className="flex w-full items-center justify-between px-2">
          <UserButton
            appearance={{
              elements: {
                rootBox: "flex-1 min-w-0",
                userButtonTrigger:
                  "w-full justify-start group-data-[collapsible=icon]:justify-center",
                userButtonOuterIdentifier: "group-data-[collapsible=icon]:hidden truncate",
              },
            }}
          />
          <Badge
            variant="secondary"
            className={`pointer-events-none shrink-0 group-data-[collapsible=icon]:hidden ${
              isPro
                ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
            }`}
          >
            {isPro ? "Pro Plan" : "Free Plan"}
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
