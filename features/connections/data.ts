import "server-only"

import { db } from "@/lib/db"
import { connections, type Connection } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"

export async function getConnections(orgId: string): Promise<Connection[]> {
  return db
    .select()
    .from(connections)
    .where(eq(connections.orgId, orgId))
    .orderBy(desc(connections.createdAt))
}

export async function getConnection(orgId: string, connectionId: string): Promise<Connection | undefined> {
  const result = await db
    .select()
    .from(connections)
    .where(and(eq(connections.orgId, orgId), eq(connections.id, connectionId)))
    .limit(1)

  return result[0]
}

export async function createConnection(
  orgId: string,
  name: string,
  provider: string,
  encryptedData: string
): Promise<Connection> {
  const result = await db
    .insert(connections)
    .values({
      orgId,
      name,
      provider,
      encryptedData,
    })
    .returning()

  return result[0]
}

export async function deleteConnection(orgId: string, connectionId: string): Promise<Connection | undefined> {
  const result = await db
    .delete(connections)
    .where(and(eq(connections.orgId, orgId), eq(connections.id, connectionId)))
    .returning()

  return result[0]
}
