"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Download,
  MessageSquare,
  Star,
  Clock,
  User,
  Phone,
  Volume2,
  Eye,
  BarChart3,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

interface Conversation {
  id: string
  customerName: string
  customerPhone: string
  startTime: string
  duration: string
  status: "completed" | "escalated" | "abandoned"
  satisfaction: number | null
  transcript: ConversationMessage[]
  summary: string
  tags: string[]
  feedback?: string
}

interface ConversationMessage {
  id: string
  speaker: "customer" | "ai"
  message: string
  timestamp: string
  confidence?: number
}

interface FeedbackItem {
  id: string
  conversationId: string
  customerName: string
  rating: number
  comment: string
  timestamp: string
  category: string
  resolved: boolean
}

export function ConversationLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const conversations: Conversation[] = [
    {
      id: "conv-001",
      customerName: "Sarah Johnson",
      customerPhone: "+1 (555) 123-4567",
      startTime: "2024-01-15 14:30:22",
      duration: "4m 32s",
      status: "completed",
      satisfaction: 5,
      summary:
        "Customer inquired about return policy for a recent purchase. AI provided detailed policy information and guided through return process.",
      tags: ["returns", "policy", "satisfied"],
      transcript: [
        {
          id: "msg-001",
          speaker: "ai",
          message: "Hello! Thank you for calling. How can I help you today?",
          timestamp: "14:30:22",
        },
        {
          id: "msg-002",
          speaker: "customer",
          message: "Hi, I need to return an item I bought last week. What's your return policy?",
          timestamp: "14:30:28",
        },
        {
          id: "msg-003",
          speaker: "ai",
          message:
            "I'd be happy to help you with that return. Our return policy allows you to return items within 30 days of purchase for a full refund. Items must be in original condition with tags attached. Do you have your order number?",
          timestamp: "14:30:35",
          confidence: 0.95,
        },
        {
          id: "msg-004",
          speaker: "customer",
          message: "Yes, it's ORDER-12345. The item doesn't fit properly.",
          timestamp: "14:30:45",
        },
        {
          id: "msg-005",
          speaker: "ai",
          message:
            "Perfect! I can see your order for the blue sweater. Since it's within our 30-day window and it's a sizing issue, you're eligible for a full refund. Would you like me to email you a prepaid return label?",
          timestamp: "14:30:52",
          confidence: 0.92,
        },
      ],
      feedback: "The AI was very helpful and resolved my issue quickly. Great service!",
    },
    {
      id: "conv-002",
      customerName: "Mike Chen",
      customerPhone: "+1 (555) 987-6543",
      startTime: "2024-01-15 15:45:10",
      duration: "2m 18s",
      status: "escalated",
      satisfaction: 3,
      summary:
        "Customer had a complex billing issue that required human agent intervention. AI attempted to help but escalated appropriately.",
      tags: ["billing", "escalated", "complex"],
      transcript: [
        {
          id: "msg-006",
          speaker: "ai",
          message: "Hello! How can I assist you today?",
          timestamp: "15:45:10",
        },
        {
          id: "msg-007",
          speaker: "customer",
          message: "I was charged twice for the same order and need this fixed immediately.",
          timestamp: "15:45:15",
        },
        {
          id: "msg-008",
          speaker: "ai",
          message:
            "I understand your concern about the duplicate charge. Let me look into this for you. Can you provide your order number?",
          timestamp: "15:45:22",
          confidence: 0.88,
        },
        {
          id: "msg-009",
          speaker: "customer",
          message: "ORDER-67890. This is really frustrating, I need this resolved now.",
          timestamp: "15:45:30",
        },
        {
          id: "msg-010",
          speaker: "ai",
          message:
            "I can see there may be a billing discrepancy that requires special attention. I'm going to connect you with a human agent who can resolve this immediately. Please hold for just a moment.",
          timestamp: "15:45:38",
          confidence: 0.75,
        },
      ],
      feedback: "AI tried to help but the issue was too complex. Human agent resolved it though.",
    },
    {
      id: "conv-003",
      customerName: "Emily Rodriguez",
      customerPhone: "+1 (555) 456-7890",
      startTime: "2024-01-15 16:20:05",
      duration: "3m 45s",
      status: "completed",
      satisfaction: 4,
      summary:
        "Customer asked about product specifications and availability. AI provided comprehensive product information.",
      tags: ["product-info", "specifications", "inventory"],
      transcript: [
        {
          id: "msg-011",
          speaker: "ai",
          message: "Good afternoon! How can I help you today?",
          timestamp: "16:20:05",
        },
        {
          id: "msg-012",
          speaker: "customer",
          message: "I'm interested in the wireless headphones you have. Can you tell me about the battery life?",
          timestamp: "16:20:12",
        },
        {
          id: "msg-013",
          speaker: "ai",
          message:
            "Great choice! Our premium wireless headphones offer up to 30 hours of battery life with active noise cancellation, and up to 40 hours with ANC off. They also support fast charging - 15 minutes gives you 3 hours of playback.",
          timestamp: "16:20:18",
          confidence: 0.97,
        },
      ],
    },
  ]

  const feedbackItems: FeedbackItem[] = [
    {
      id: "fb-001",
      conversationId: "conv-001",
      customerName: "Sarah Johnson",
      rating: 5,
      comment: "The AI was very helpful and resolved my issue quickly. Great service!",
      timestamp: "2024-01-15 14:35:00",
      category: "positive",
      resolved: true,
    },
    {
      id: "fb-002",
      conversationId: "conv-002",
      customerName: "Mike Chen",
      rating: 3,
      comment: "AI tried to help but the issue was too complex. Human agent resolved it though.",
      timestamp: "2024-01-15 15:48:00",
      category: "neutral",
      resolved: true,
    },
    {
      id: "fb-003",
      conversationId: "conv-004",
      customerName: "David Kim",
      rating: 2,
      comment: "The AI didn't understand my question and kept giving irrelevant answers.",
      timestamp: "2024-01-15 13:22:00",
      category: "negative",
      resolved: false,
    },
  ]

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || conv.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "escalated":
        return "secondary"
      case "abandoned":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "escalated":
        return "text-yellow-600"
      case "abandoned":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSatisfactionStars = (rating: number | null) => {
    if (!rating) return "No rating"
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  const getFeedbackCategoryBadge = (category: string) => {
    switch (category) {
      case "positive":
        return "default"
      case "neutral":
        return "secondary"
      case "negative":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Conversation Logs</h2>
          <p className="text-gray-600">Review customer conversations and feedback for continuous improvement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
            <p className="text-xs text-gray-600">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                conversations.filter((c) => c.satisfaction).reduce((sum, c) => sum + (c.satisfaction || 0), 0) /
                conversations.filter((c) => c.satisfaction).length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-gray-600">Out of 5 stars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((conversations.filter((c) => c.status === "completed").length / conversations.length) * 100)}%
            </div>
            <p className="text-xs text-gray-600">Successfully resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((conversations.filter((c) => c.status === "escalated").length / conversations.length) * 100)}%
            </div>
            <p className="text-xs text-gray-600">Required human help</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <Card key={conversation.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <CardTitle className="text-lg">{conversation.customerName}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {conversation.customerPhone}
                          <Clock className="h-3 w-3 ml-2" />
                          {conversation.startTime} • {conversation.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadge(conversation.status)}>{conversation.status}</Badge>
                      {conversation.satisfaction && (
                        <div className="text-sm text-yellow-600">{getSatisfactionStars(conversation.satisfaction)}</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{conversation.summary}</p>
                    <div className="flex items-center gap-2">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                            <Eye className="h-3 w-3" />
                            View Transcript
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Conversation Transcript - {conversation.customerName}</DialogTitle>
                            <DialogDescription>
                              {conversation.startTime} • Duration: {conversation.duration}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {conversation.transcript.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.speaker === "ai" ? "justify-start" : "justify-end"}`}
                              >
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    message.speaker === "ai" ? "bg-blue-50 text-blue-900" : "bg-gray-100 text-gray-900"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium">
                                      {message.speaker === "ai" ? "AI Assistant" : "Customer"}
                                    </span>
                                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    {message.confidence && (
                                      <Badge variant="outline" className="text-xs">
                                        {Math.round(message.confidence * 100)}% confidence
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm">{message.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                        <Volume2 className="h-3 w-3" />
                        Play Audio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Customer Feedback
              </CardTitle>
              <CardDescription>Review and respond to customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackItems.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-600" />
                        <div>
                          <span className="font-medium">{feedback.customerName}</span>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>{getSatisfactionStars(feedback.rating)}</span>
                            <span>•</span>
                            <span>{feedback.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getFeedbackCategoryBadge(feedback.category)}>{feedback.category}</Badge>
                        {!feedback.resolved && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Needs Response
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{feedback.comment}</p>
                    {!feedback.resolved && (
                      <div className="space-y-2">
                        <Label htmlFor={`response-${feedback.id}`}>Response</Label>
                        <Textarea
                          id={`response-${feedback.id}`}
                          placeholder="Type your response to this feedback..."
                          rows={2}
                        />
                        <Button size="sm">Send Response</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Outcomes</CardTitle>
                <CardDescription>Distribution of conversation results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Successfully</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Escalated to Human</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "33%" }}></div>
                      </div>
                      <span className="text-sm font-medium">33%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Abandoned</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Topics</CardTitle>
                <CardDescription>Most frequent conversation topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Returns & Refunds</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Product Information</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Billing Issues</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Support</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Customer satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-8 w-8 mx-auto mb-1 opacity-50" />
                    <p className="text-sm">Satisfaction trend chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Opportunities</CardTitle>
                <CardDescription>Areas identified for enhancement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Complex Billing Issues</p>
                      <p className="text-xs text-gray-600">Consider adding more billing-specific training data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Product Specifications</p>
                      <p className="text-xs text-gray-600">Update product database with latest specifications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
