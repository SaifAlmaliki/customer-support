import { type NextRequest, NextResponse } from "next/server"
import { getStripeClient, PRICING_PLANS } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { planId, companyId } = await request.json()

    if (!planId || !companyId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const supabase = createClient()

    // Verify user has access to this company
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .single()

    if (!userProfile || userProfile.company_id !== companyId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const stripe = getStripeClient()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/billing?canceled=true`,
      metadata: {
        companyId,
        planId,
        userId: user.id,
      },
      customer_email: user.email,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
