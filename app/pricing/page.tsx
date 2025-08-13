"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MessageSquare, ArrowLeft } from "lucide-react"
import { PRICING_PLANS } from "@/lib/stripe"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Support Pro</span>
          </Link>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Choose Your Perfect Plan</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Scale your AI customer support with flexible pricing that grows with your business. All plans include our
            core features with different usage limits.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(PRICING_PLANS).map(([planId, plan]) => (
              <Card
                key={planId}
                className={`relative border-2 hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "border-blue-500 shadow-lg scale-105" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mt-2 text-lg">{plan.description}</CardDescription>
                  <div className="mt-8">
                    <span className="text-6xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-2 text-lg">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Features included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Usage Limits:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        Conversations:{" "}
                        {plan.limits.conversations === -1
                          ? "Unlimited"
                          : `${plan.limits.conversations.toLocaleString()}/month`}
                      </li>
                      <li>Data Sources: {plan.limits.dataSources === -1 ? "Unlimited" : plan.limits.dataSources}</li>
                      <li>Team Members: {plan.limits.users === -1 ? "Unlimited" : plan.limits.users}</li>
                    </ul>
                  </div>

                  <Button
                    className={`w-full py-4 text-lg font-semibold ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                    asChild
                  >
                    <Link href={`/admin?plan=${planId}`}>{plan.popular ? "Start Free Trial" : "Get Started"}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate the billing accordingly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my usage limits?</h3>
              <p className="text-gray-600">
                We'll notify you when you approach your limits. You can upgrade your plan or purchase additional usage
                credits to continue service without interruption.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All plans come with a 14-day free trial. No credit card required to start, and you can cancel
                anytime during the trial period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer custom enterprise solutions?</h3>
              <p className="text-gray-600">
                Our Enterprise plan can be customized for large organizations with specific requirements. Contact our
                sales team for a personalized quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already transforming their customer service with AI Support Pro.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3" asChild>
            <Link href="/admin">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
