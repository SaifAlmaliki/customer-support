import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("data_sources")
      .select("*")
      .eq("company_id", user.profile.company_id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, connection_config, sync_frequency } = body

    if (!name || !type || !connection_config) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("data_sources")
      .insert([
        {
          company_id: user.profile.company_id,
          name,
          type,
          connection_config,
          sync_frequency: sync_frequency || "manual",
          created_by: user.id,
          status: "disconnected",
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
