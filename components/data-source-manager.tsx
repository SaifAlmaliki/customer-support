"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  FileText,
  Globe,
  Plus,
  Settings,
  TestTube,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  Upload,
  Loader2,
} from "lucide-react"

interface DataSource {
  id: string
  name: string
  type: "postgresql" | "mysql" | "mongodb" | "api" | "documents" | "csv"
  status: "connected" | "disconnected" | "error" | "syncing"
  last_sync_at: string | null
  sync_frequency: "manual" | "hourly" | "daily" | "weekly"
  connection_config: any
  error_message?: string
  created_at: string
}

interface DataSourceManagerProps {
  user: {
    id: string
    profile: {
      company_id: string
    }
  }
}

export function DataSourceManager({ user }: DataSourceManagerProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchDataSources()
  }, [])

  const fetchDataSources = async () => {
    try {
      const response = await fetch("/api/data-sources")
      if (response.ok) {
        const result = await response.json()
        setDataSources(result.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch data sources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    // Simulate connection test
    setTimeout(() => {
      setIsTestingConnection(false)
    }, 2000)
  }

  const handleAddDataSource = async (formData: FormData) => {
    setIsSaving(true)
    try {
      const connectionConfig = {
        host: formData.get("db-host") || formData.get("api-url"),
        database: formData.get("db-database"),
        username: formData.get("db-username"),
        password: formData.get("db-password"),
        auth_type: formData.get("api-auth"),
        token: formData.get("api-token"),
        endpoints: formData.get("api-endpoints")?.toString().split("\n").filter(Boolean),
      }

      const response = await fetch("/api/data-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name") || `New ${selectedType} Source`,
          type: selectedType,
          connection_config: connectionConfig,
          sync_frequency: "manual",
        }),
      })

      if (response.ok) {
        await fetchDataSources()
        setIsAddDialogOpen(false)
        setSelectedType("")
      }
    } catch (error) {
      console.error("Failed to add data source:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSource = async (id: string) => {
    try {
      const response = await fetch(`/api/data-sources/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setDataSources(dataSources.filter((source) => source.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete data source:", error)
    }
  }

  const handleSyncSource = async (id: string) => {
    try {
      const response = await fetch(`/api/data-sources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "syncing",
        }),
      })
      if (response.ok) {
        // Simulate sync completion
        setTimeout(async () => {
          await fetch(`/api/data-sources/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "connected",
              last_sync_at: new Date().toISOString(),
            }),
          })
          await fetchDataSources()
        }, 3000)
        await fetchDataSources()
      }
    } catch (error) {
      console.error("Failed to sync data source:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case "disconnected":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "postgresql":
      case "mysql":
      case "mongodb":
        return <Database className="h-5 w-5 text-blue-600" />
      case "api":
        return <Globe className="h-5 w-5 text-green-600" />
      case "documents":
      case "csv":
        return <FileText className="h-5 w-5 text-purple-600" />
      default:
        return <Database className="h-5 w-5 text-gray-400" />
    }
  }

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return "Never"
    const date = new Date(lastSync)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Sources</h2>
          <p className="text-gray-600">Connect and manage your knowledge sources</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription>
                Connect a new data source to enhance your AI assistant's knowledge base
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAddDataSource(formData)
              }}
            >
              <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="postgresql">Database</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="postgresql" className="space-y-4">
                  {/* ... existing database form fields ... */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="db-name">Connection Name</Label>
                      <Input id="db-name" name="name" placeholder="Customer Database" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-type">Database Type</Label>
                      <Select name="db-type">
                        <SelectTrigger>
                          <SelectValue placeholder="Select database type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgresql">PostgreSQL</SelectItem>
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="mongodb">MongoDB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db-host">Host</Label>
                    <Input id="db-host" name="db-host" placeholder="localhost:5432" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="db-username">Username</Label>
                      <Input id="db-username" name="db-username" placeholder="admin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-password">Password</Label>
                      <Input id="db-password" name="db-password" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db-database">Database Name</Label>
                    <Input id="db-database" name="db-database" placeholder="customer_support" />
                  </div>
                </TabsContent>

                {/* ... existing API and documents tabs ... */}
                <TabsContent value="api" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-name">API Name</Label>
                    <Input id="api-name" name="name" placeholder="Product API" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-url">Base URL</Label>
                    <Input id="api-url" name="api-url" placeholder="https://api.example.com/v1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-auth">Authentication Type</Label>
                      <Select name="api-auth">
                        <SelectTrigger>
                          <SelectValue placeholder="Select auth type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                          <SelectItem value="apikey">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-token">API Token/Key</Label>
                      <Input id="api-token" name="api-token" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-endpoints">Endpoints (one per line)</Label>
                    <Textarea
                      id="api-endpoints"
                      name="api-endpoints"
                      placeholder="/products&#10;/categories&#10;/users"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doc-name">Collection Name</Label>
                    <Input id="doc-name" name="name" placeholder="Policy Documents" />
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                    <p className="text-xs text-gray-500">Supports PDF, DOCX, TXT files up to 10MB each</p>
                    <Button type="button" variant="outline" className="mt-4 bg-transparent">
                      Choose Files
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={!selectedType || isTestingConnection}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <TestTube className="h-4 w-4" />
                  {isTestingConnection ? "Testing..." : "Test Connection"}
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!selectedType || isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Data Source
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <Card key={source.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(source.type)}
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {source.type} • {source.sync_frequency} sync
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(source.status)}
                  <Badge
                    variant={
                      source.status === "connected"
                        ? "default"
                        : source.status === "syncing"
                          ? "secondary"
                          : source.status === "disconnected"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {source.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Last sync:</span>
                  <span className="text-gray-600">{formatLastSync(source.last_sync_at)}</span>
                </div>
                {source.error_message && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{source.error_message}</div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSyncSource(source.id)}
                      disabled={source.status === "syncing"}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className={`h-3 w-3 ${source.status === "syncing" ? "animate-spin" : ""}`} />
                      Sync
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <Settings className="h-3 w-3" />
                      Config
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSource(source.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSources.length}</div>
            <p className="text-xs text-gray-600">Active connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dataSources.filter((s) => s.status === "connected").length}
            </div>
            <p className="text-xs text-gray-600">Successfully synced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dataSources.filter((s) => s.status === "error").length}
            </div>
            <p className="text-xs text-gray-600">Need attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
