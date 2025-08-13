import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { incrementUsage, checkUsageLimit } from "@/lib/subscription-utils"

export async function POST(request: NextRequest) {
  try {
    const { companyId, usageType, amount = 1 } = await request.json()

    if (!companyId || !usageType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
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

    // Check if usage is allowed
    const canUse = await checkUsageLimit(companyId, usageType)
    if (!canUse) {
      return NextResponse.json({ error: "Usage limit exceeded" }, { status: 429 })
    }

    // Increment usage
    const success = await incrementUsage(companyId, usageType, amount)
    if (!success) {
      return NextResponse.json({ error: "Failed to update usage" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
