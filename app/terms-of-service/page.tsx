import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Support Pro</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using AI Support Pro ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
              <p>If you do not agree to abide by the above, please do not use this service.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>AI Support Pro provides AI-powered customer support solutions including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI voice assistants for customer service</li>
                <li>Knowledge base integration and management</li>
                <li>Real-time conversation monitoring and analytics</li>
                <li>Integration with third-party services and APIs</li>
                <li>Customizable AI configuration and training</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You are responsible for maintaining the confidentiality of your account and password and for restricting
                access to your computer.
              </p>
              <p>You agree to accept responsibility for all activities that occur under your account or password.</p>
              <p>
                You must provide accurate and complete information when creating your account and keep this information
                updated.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Subscription and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our service is offered on a subscription basis with different pricing tiers:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Starter Plan: $49/month</li>
                <li>Professional Plan: $149/month</li>
                <li>Enterprise Plan: $399/month</li>
              </ul>
              <p>
                All subscriptions automatically renew unless cancelled. You may cancel your subscription at any time
                through your account settings.
              </p>
              <p>Refunds are provided on a case-by-case basis within 14 days of initial purchase.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Usage and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We take your privacy seriously. Please review our Privacy Policy to understand how we collect, use, and
                protect your information.
              </p>
              <p>
                You retain ownership of all data you upload to our service. We use this data solely to provide the AI
                support services.
              </p>
              <p>
                We implement industry-standard security measures to protect your data and ensure compliance with
                applicable data protection regulations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You agree not to use the service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for spam or unsolicited communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service availability.</p>
              <p>We reserve the right to modify, suspend, or discontinue the service with reasonable notice.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                AI Support Pro shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of the service.
              </p>
              <p>
                Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding
                the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of significant changes via
                email or through the service.
              </p>
              <p>Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> legal@aisupportpro.com
                <br />
                <strong>Address:</strong> 123 AI Street, Tech City, TC 12345
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
