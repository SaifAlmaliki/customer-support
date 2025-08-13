"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const companyName = formData.get("company")
  const selectedPlan = formData.get("plan") || "starter"

  if (!email || !password || !companyName) {
    return { error: "All fields are required" }
  }

  const supabase = createClient()

  try {
    // First create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`,
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 14) // 14-day trial

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([
          {
            name: companyName.toString(),
            email: email.toString(),
            subscription_plan: selectedPlan.toString(),
            subscription_status: "trialing",
            trial_ends_at: trialEndDate.toISOString(),
          },
        ])
        .select()
        .single()

      if (companyError) {
        console.error("Company creation error:", companyError)
        if (companyError.message.includes("table") && companyError.message.includes("does not exist")) {
          return { error: "Database setup incomplete. Please contact support to set up your account." }
        }
        return { error: `Failed to create company profile: ${companyError.message}` }
      }

      // Create user profile
      const { error: profileError } = await supabase.from("user_profiles").insert([
        {
          id: authData.user.id,
          company_id: companyData.id,
          email: email.toString(),
          full_name: email.toString().split("@")[0],
          role: "admin",
        },
      ])

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return { error: `Failed to create user profile: ${profileError.message}` }
      }

      const { error: usageError } = await supabase.from("subscription_usage").insert([
        {
          company_id: companyData.id,
          usage_type: "conversations",
          current_usage: 0,
          usage_limit: selectedPlan === "starter" ? 100 : selectedPlan === "professional" ? 1000 : 10000,
        },
        {
          company_id: companyData.id,
          usage_type: "data_sources",
          current_usage: 0,
          usage_limit: selectedPlan === "starter" ? 3 : selectedPlan === "professional" ? 10 : 50,
        },
        {
          company_id: companyData.id,
          usage_type: "users",
          current_usage: 1,
          usage_limit: selectedPlan === "starter" ? 3 : selectedPlan === "professional" ? 10 : 100,
        },
      ])

      if (usageError) {
        console.error("Usage tracking creation error:", usageError)
      }
    }

    return {
      success:
        selectedPlan === "starter"
          ? "Account created! Please check your email to confirm your account."
          : "Account created! Please check your email to confirm your account. Your 14-day free trial has started.",
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/admin")
}

export async function getCurrentUser() {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user profile with company info
  const { data: profile } = await supabase
    .from("user_profiles")
    .select(`
      *,
      companies (
        id,
        name,
        email,
        subscription_plan,
        subscription_status
      )
    `)
    .eq("id", user.id)
    .single()

  return {
    ...user,
    profile: {
      ...profile,
      companies: {
        ...profile.companies,
        plan: profile.companies.subscription_plan,
        status: profile.companies.subscription_status,
      },
    },
  }
}
