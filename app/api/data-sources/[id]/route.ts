import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, connection_config, sync_frequency, status } = body

    const supabase = createClient()
    const { data, error } = await supabase
      .from("data_sources")
      .update({
        name,
        connection_config,
        sync_frequency,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("company_id", user.profile.company_id)
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user?.profile?.company_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const { error } = await supabase
      .from("data_sources")
      .delete()
      .eq("id", params.id)
      .eq("company_id", user.profile.company_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
