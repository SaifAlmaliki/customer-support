"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MessageSquare, Brain, Clock, TrendingUp, Users, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { PricingSection } from "@/components/pricing-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Support Pro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Admin Login
            </Link>
          </nav>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🚀 Transform Your Customer Service with AI
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Customer Support
            <span className="text-blue-600 block">That Never Sleeps</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your customer service with intelligent AI voice assistants that provide instant, accurate
            responses 24/7. Reduce costs by up to 80% while improving customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3" asChild>
              <Link href="/auth/signup">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent" asChild>
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              No setup fees
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with More Detail */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete AI Customer Support Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to deploy, manage, and optimize AI-powered customer service that scales with your
              business
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Advanced RAG Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Retrieval-Augmented Generation ensures accurate, contextual responses by leveraging your knowledge
                  base, databases, and documentation in real-time.
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Vector database integration</li>
                  <li>• Real-time content indexing</li>
                  <li>• Multi-source knowledge synthesis</li>
                  <li>• Confidence scoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">24/7 Intelligent Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Never miss a customer inquiry with AI assistants that work around the clock, providing instant support
                  across all time zones and holidays.
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Instant response times</li>
                  <li>• Multi-language support</li>
                  <li>• Escalation to human agents</li>
                  <li>• Holiday and weekend coverage</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">Massive Cost Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Reduce customer service costs by up to 80% while handling 10x more inquiries with consistent,
                  high-quality responses.
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 80% cost reduction</li>
                  <li>• 10x inquiry capacity</li>
                  <li>• Consistent quality</li>
                  <li>• ROI tracking dashboard</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle className="text-xl">Universal Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Connect your existing databases, CRM systems, and knowledge bases. Our platform integrates with your
                  current workflow effortlessly.
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CRM system integration</li>
                  <li>• Database connectivity</li>
                  <li>• API endpoint management</li>
                  <li>• n8n workflow automation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">Human-Like Voice AI</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  ElevenLabs integration provides human-like voice responses that create natural, engaging conversations
                  with your customers.
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ElevenLabs voice synthesis</li>
                  <li>• Custom voice training</li>
                  <li>• Emotion and tone control</li>
                  <li>• Multi-accent support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle className="text-xl">Continuous AI Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  AI improves over time by learning from interactions, feedback, and your evolving knowledge base to
                  provide better responses.
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Feedback loop integration</li>
                  <li>• Performance analytics</li>
                  <li>• Model fine-tuning</li>
                  <li>• A/B testing capabilities</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Platform Capabilities */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Complete Management Platform</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Source Management</h4>
                <p className="text-sm text-gray-600">Connect databases, APIs, and documents with real-time sync</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Configuration</h4>
                <p className="text-sm text-gray-600">Customize personality, voice, and response behavior</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h4>
                <p className="text-sm text-gray-600">Real-time performance metrics and conversation insights</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Testing & Simulation</h4>
                <p className="text-sm text-gray-600">Test scenarios and validate responses before going live</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect Your Data</h3>
              <p className="text-gray-600 text-lg">
                Upload your knowledge base, connect databases, and integrate APIs. Our system automatically indexes and
                processes your content.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Configure AI Assistant</h3>
              <p className="text-gray-600 text-lg">
                Customize your AI's personality, voice, and response style. Set up escalation rules and fine-tune
                behavior to match your brand.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Go Live & Monitor</h3>
              <p className="text-gray-600 text-lg">
                Deploy your AI assistant and monitor performance in real-time. Track metrics, gather feedback, and
                continuously improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section id="register" className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Customer Service?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already using AI Support Pro to deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer with updated links */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">AI Support Pro</span>
              </div>
              <p className="text-gray-400">Revolutionizing customer service with intelligent AI voice assistants.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-white transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@aisupportpro.com" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="mailto:sales@aisupportpro.com" className="hover:text-white transition-colors">
                    Sales Inquiry
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="mailto:security@aisupportpro.com" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Support Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
