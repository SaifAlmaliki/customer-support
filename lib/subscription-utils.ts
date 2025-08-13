import { createClient } from "@/lib/supabase/client"
import { PRICING_PLANS, type PricingPlan } from "@/lib/stripe"

export interface SubscriptionInfo {
  plan: PricingPlan
  status: "active" | "inactive" | "past_due" | "canceled"
  currentUsage: {
    conversations: number
    dataSources: number
    users: number
  }
  limits: {
    conversations: number
    dataSources: number
    users: number
  }
  usagePercentage: {
    conversations: number
    dataSources: number
    users: number
  }
}

export async function getSubscriptionInfo(companyId: string): Promise<SubscriptionInfo | null> {
  const supabase = createClient()

  try {
    // Get company subscription details
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("subscription_plan, subscription_status")
      .eq("id", companyId)
      .single()

    if (companyError || !company) {
      console.error("Error fetching company:", companyError)
      return null
    }

    const plan = (company.subscription_plan as PricingPlan) || "starter"
    const planDetails = PRICING_PLANS[plan]

    // Get current usage
    const { data: usageData, error: usageError } = await supabase.rpc("get_current_usage", { company_uuid: companyId })

    if (usageError) {
      console.error("Error fetching usage:", usageError)
      return null
    }

    const currentUsage = {
      conversations: usageData?.conversations_used || 0,
      dataSources: usageData?.data_sources_used || 0,
      users: usageData?.users_count || 0,
    }

    const limits = {
      conversations: planDetails.limits.conversations,
      dataSources: planDetails.limits.dataSources,
      users: planDetails.limits.users,
    }

    const usagePercentage = {
      conversations: limits.conversations === -1 ? 0 : (currentUsage.conversations / limits.conversations) * 100,
      dataSources: limits.dataSources === -1 ? 0 : (currentUsage.dataSources / limits.dataSources) * 100,
      users: limits.users === -1 ? 0 : (currentUsage.users / limits.users) * 100,
    }

    return {
      plan,
      status: company.subscription_status || "inactive",
      currentUsage,
      limits,
      usagePercentage,
    }
  } catch (error) {
    console.error("Error getting subscription info:", error)
    return null
  }
}

export async function checkUsageLimit(
  companyId: string,
  usageType: "conversations" | "dataSources" | "users",
): Promise<boolean> {
  const subscriptionInfo = await getSubscriptionInfo(companyId)

  if (!subscriptionInfo) return false

  const { currentUsage, limits } = subscriptionInfo
  const limit = limits[usageType]

  // Unlimited usage
  if (limit === -1) return true

  // Check if under limit
  return currentUsage[usageType] < limit
}

export async function incrementUsage(
  companyId: string,
  usageType: "conversations" | "data_sources" | "users",
  amount = 1,
): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase.rpc("increment_usage", {
      company_uuid: companyId,
      usage_type: usageType,
      increment_by: amount,
    })

    if (error) {
      console.error("Error incrementing usage:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error incrementing usage:", error)
    return false
  }
}
