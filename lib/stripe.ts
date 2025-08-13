import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    })
  }
  return stripe
}

// Export stripe for backward compatibility, but initialize lazily
export { getStripeClient as stripe }

// Pricing plans configuration - can be accessed without Stripe secrets
export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    description: "Perfect for small businesses getting started with AI customer support",
    price: 49,
    priceId: "price_starter_monthly", // Replace with actual Stripe price ID
    features: [
      "Up to 1,000 conversations/month",
      "1 AI voice assistant",
      "Basic analytics",
      "Email support",
      "2 data source connections",
      "Standard response time",
    ],
    limits: {
      conversations: 1000,
      dataSources: 2,
      users: 3,
    },
  },
  professional: {
    name: "Professional",
    description: "Ideal for growing businesses with higher volume needs",
    price: 149,
    priceId: "price_professional_monthly", // Replace with actual Stripe price ID
    features: [
      "Up to 10,000 conversations/month",
      "3 AI voice assistants",
      "Advanced analytics & reporting",
      "Priority support",
      "10 data source connections",
      "Custom voice training",
      "API access",
    ],
    limits: {
      conversations: 10000,
      dataSources: 10,
      users: 10,
    },
    popular: true,
  },
  enterprise: {
    name: "Enterprise",
    description: "For large organizations with custom requirements",
    price: 499,
    priceId: "price_enterprise_monthly", // Replace with actual Stripe price ID
    features: [
      "Unlimited conversations",
      "Unlimited AI voice assistants",
      "Custom analytics dashboard",
      "Dedicated support manager",
      "Unlimited data sources",
      "White-label options",
      "Custom integrations",
      "SLA guarantee",
    ],
    limits: {
      conversations: -1, // Unlimited
      dataSources: -1, // Unlimited
      users: -1, // Unlimited
    },
  },
} as const

export type PricingPlan = keyof typeof PRICING_PLANS
