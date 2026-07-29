import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

import { getConnections } from "@/features/connections/data"
import { AddConnectionDialog } from "@/features/connections/components/add-connection-dialog"
import { ConnectionsList } from "@/features/connections/components/connections-list"

export default async function ConnectionsPage() {
  const { orgId } = await auth()
  
  if (!orgId) {
    redirect("/sign-in")
  }

  const connections = await getConnections(orgId)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Connections</h2>
          <p className="text-muted-foreground mt-1">
            Manage your third-party integrations and secrets securely.{" "}
            <Link 
              href="/how-it-works" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Need help? Read the setup guide.
            </Link>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddConnectionDialog />
        </div>
      </div>
      <ConnectionsList connections={connections} />
    </div>
  )
}
