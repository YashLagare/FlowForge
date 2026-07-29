"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createConnectionAction } from "../actions"

export function AddConnectionDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [name, setName] = useState("")
  const [provider, setProvider] = useState("google-sheets")
  const [credentials, setCredentials] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (provider === "google-sheets") {
        // Simple validation to ensure it's JSON
        JSON.parse(credentials)
      }

      await createConnectionAction({
        name,
        provider,
        credentials,
      })

      toast.success("Connection added successfully")
      setOpen(false)
      setName("")
      setCredentials("")
    } catch (error: any) {
      toast.error(error.message || "Failed to add connection. Check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Connection</DialogTitle>
            <DialogDescription>
              Connect a third-party service to use in your workflows. Credentials are encrypted at rest.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">Service Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google-sheets">Google Sheets</SelectItem>
                  {/* Future providers go here */}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Connection Name</Label>
              <Input
                id="name"
                placeholder="e.g. My Company Sheets"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {provider === "google-sheets" && (
              <div className="grid gap-2">
                <Label htmlFor="credentials">Service Account JSON</Label>
                <Textarea
                  id="credentials"
                  placeholder='{"type": "service_account", ...}'
                  className="min-h-[150px] max-h-64 overflow-y-auto resize-none font-mono text-sm"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
