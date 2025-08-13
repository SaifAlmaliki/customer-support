import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    const supabase = createClient()
    let query = supabase
      .from("conversations")
      .select(`
        *,
        ai_configurations (name),
        customer_feedback (rating, feedback_text)
      `)
      .eq("company_id", user.profile.company_id)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
