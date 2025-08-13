"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  RefreshCw,
  Database,
  FileText,
  Globe,
  Settings,
  Play,
  Pause,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Brain,
  Filter,
} from "lucide-react"

interface IndexedContent {
  id: string
  title: string
  source: string
  sourceType: "database" | "api" | "documents"
  chunks: number
  lastIndexed: string
  status: "indexed" | "indexing" | "error"
  size: string
  preview: string
}

interface IndexingJob {
  id: string
  source: string
  status: "running" | "completed" | "failed" | "queued"
  progress: number
  startTime: string
  itemsProcessed: number
  totalItems: number
}

export function KnowledgeBaseManager() {
  const [indexedContent, setIndexedContent] = useState<IndexedContent[]>([
    {
      id: "1",
      title: "Customer Support Tickets",
      source: "Customer Database",
      sourceType: "database",
      chunks: 1247,
      lastIndexed: "2 hours ago",
      status: "indexed",
      size: "2.3 MB",
      preview: "Ticket #12345: Customer experiencing login issues with mobile app...",
    },
    {
      id: "2",
      title: "Company Policy Manual",
      source: "Policy Documents",
      sourceType: "documents",
      chunks: 89,
      lastIndexed: "1 day ago",
      status: "indexed",
      size: "1.8 MB",
      preview: "Section 4.2: Return Policy - All items can be returned within 30 days...",
    },
    {
      id: "3",
      title: "Product Catalog",
      source: "Product API",
      sourceType: "api",
      chunks: 456,
      lastIndexed: "6 hours ago",
      status: "indexing",
      size: "3.1 MB",
      preview: "Product SKU: ABC123 - Premium Wireless Headphones with noise cancellation...",
    },
  ])

  const [indexingJobs, setIndexingJobs] = useState<IndexingJob[]>([
    {
      id: "1",
      source: "Product API",
      status: "running",
      progress: 67,
      startTime: "10 minutes ago",
      itemsProcessed: 304,
      totalItems: 456,
    },
    {
      id: "2",
      source: "New Policy Documents",
      status: "queued",
      progress: 0,
      startTime: "Pending",
      itemsProcessed: 0,
      totalItems: 23,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isReindexing, setIsReindexing] = useState(false)

  const handleReindex = (contentId: string) => {
    setIsReindexing(true)
    // Simulate reindexing
    setTimeout(() => {
      setIndexedContent((content) =>
        content.map((item) =>
          item.id === contentId ? { ...item, status: "indexing" as const, lastIndexed: "Just now" } : item,
        ),
      )
      setIsReindexing(false)
    }, 1000)
  }

  const handleDeleteContent = (contentId: string) => {
    setIndexedContent((content) => content.filter((item) => item.id !== contentId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "indexed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "indexing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="h-4 w-4 text-blue-600" />
      case "api":
        return <Globe className="h-4 w-4 text-green-600" />
      case "documents":
        return <FileText className="h-4 w-4 text-purple-600" />
      default:
        return <Database className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredContent = indexedContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || item.sourceType === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h2>
          <p className="text-gray-600">Manage indexed content and RAG pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Vector Settings
          </Button>
          <Button className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Reindex All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chunks</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {indexedContent.reduce((sum, item) => sum + item.chunks, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Indexed for retrieval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2 MB</div>
            <p className="text-xs text-gray-600">Vector database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <RefreshCw className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{indexingJobs.filter((job) => job.status === "running").length}</div>
            <p className="text-xs text-gray-600">Currently indexing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-gray-600">ago</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Indexed Content</TabsTrigger>
          <TabsTrigger value="jobs">Indexing Jobs</TabsTrigger>
          <TabsTrigger value="settings">RAG Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search indexed content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
                <SelectItem value="api">APIs</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {filteredContent.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getSourceIcon(content.sourceType)}
                      <div>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <CardDescription>
                          From: {content.source} • {content.chunks} chunks • {content.size}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(content.status)}
                      <Badge
                        variant={
                          content.status === "indexed"
                            ? "default"
                            : content.status === "indexing"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {content.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      <strong>Preview:</strong> {content.preview}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last indexed: {content.lastIndexed}</span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                              <Eye className="h-3 w-3" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{content.title}</DialogTitle>
                              <DialogDescription>Indexed content from {content.source}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Source:</strong> {content.source}
                                </div>
                                <div>
                                  <strong>Chunks:</strong> {content.chunks}
                                </div>
                                <div>
                                  <strong>Size:</strong> {content.size}
                                </div>
                                <div>
                                  <strong>Last Indexed:</strong> {content.lastIndexed}
                                </div>
                              </div>
                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Sample Chunks:</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                  <div className="bg-gray-50 p-3 rounded text-sm">
                                    <strong>Chunk 1:</strong> {content.preview}
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded text-sm">
                                    <strong>Chunk 2:</strong> Additional content from the same source providing context
                                    for customer inquiries...
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded text-sm">
                                    <strong>Chunk 3:</strong> More detailed information that helps the AI assistant
                                    provide accurate responses...
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReindex(content.id)}
                          disabled={isReindexing || content.status === "indexing"}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Reindex
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="space-y-4">
            {indexingJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.source}</CardTitle>
                      <CardDescription>
                        {job.itemsProcessed} of {job.totalItems} items processed
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        job.status === "running"
                          ? "default"
                          : job.status === "completed"
                            ? "secondary"
                            : job.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="w-full" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Started: {job.startTime}</span>
                      <div className="flex gap-2">
                        {job.status === "running" && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        {job.status === "queued" && (
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RAG Configuration</CardTitle>
              <CardDescription>Configure how content is processed and indexed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chunk-size">Chunk Size</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500 tokens</SelectItem>
                      <SelectItem value="1000">1000 tokens</SelectItem>
                      <SelectItem value="1500">1500 tokens</SelectItem>
                      <SelectItem value="2000">2000 tokens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overlap">Chunk Overlap</Label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 tokens</SelectItem>
                      <SelectItem value="100">100 tokens</SelectItem>
                      <SelectItem value="200">200 tokens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="embedding-model">Embedding Model</Label>
                <Select defaultValue="openai">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI text-embedding-3-small</SelectItem>
                    <SelectItem value="openai-large">OpenAI text-embedding-3-large</SelectItem>
                    <SelectItem value="cohere">Cohere embed-english-v3.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vector-db">Vector Database</Label>
                <Select defaultValue="pinecone">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pinecone">Pinecone</SelectItem>
                    <SelectItem value="weaviate">Weaviate</SelectItem>
                    <SelectItem value="chromadb">ChromaDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
