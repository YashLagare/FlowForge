"use client"

import { useState } from "react"
import { Cable, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Connection } from "@/lib/db/schema"
import { deleteConnectionAction } from "../actions"

export function ConnectionsList({ connections }: { connections: Connection[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    try {
      setIsDeleting(id)
      await deleteConnectionAction(id)
      toast.success("Connection deleted")
    } catch (error) {
      toast.error("Failed to delete connection")
    } finally {
      setIsDeleting(null)
    }
  }

  if (connections.length === 0) {
    return (
      <div className="flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Cable className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No connections added</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven't added any connections yet. Add one to use it in your workflows.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {connections.map((connection) => (
        <Card key={connection.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              {connection.name}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  disabled={isDeleting === connection.id}
                  onClick={() => handleDelete(connection.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Provider: <span className="font-medium text-foreground">{connection.provider}</span>
            </div>
            <CardDescription className="mt-2 text-xs">
              Added {new Date(connection.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
