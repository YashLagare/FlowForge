"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"

import { createConnection, deleteConnection, getConnections } from "./data"
import { encrypt } from "@/lib/encryption"

export async function createConnectionAction({
  name,
  provider,
  credentials,
}: {
  name: string
  provider: string
  credentials: string
}) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("No active organization")

  Sentry.getIsolationScope().setAttributes({ action: "createConnectionAction", orgId })

  let encryptedData: string
  try {
    encryptedData = encrypt(credentials)
  } catch (error) {
    Sentry.logger.error("Failed to encrypt credentials", { error })
    throw new Error("Internal error: Could not encrypt credentials")
  }

  const connection = await createConnection(orgId, name, provider, encryptedData)

  Sentry.logger.info("Connection created", { connectionId: connection.id, provider, orgId })

  revalidatePath("/connections", "layout")
  return { id: connection.id }
}

export async function deleteConnectionAction(id: string) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("No active organization")

  Sentry.getIsolationScope().setAttributes({ action: "deleteConnectionAction", orgId, connectionId: id })

  const connection = await deleteConnection(orgId, id)

  if (!connection) {
    Sentry.logger.warn("Connection delete skipped — not found", { connectionId: id, orgId })
    throw new Error("Connection not found")
  }

  Sentry.logger.info("Connection deleted", { connectionId: id, orgId })

  revalidatePath("/connections", "layout")
}

export async function getConnectionsByProviderAction(provider: string) {
  const { orgId } = await auth()
  if (!orgId) return []
  const connections = await getConnections(orgId)
  return connections.filter((c) => c.provider === provider).map(c => ({ id: c.id, name: c.name }))
}
