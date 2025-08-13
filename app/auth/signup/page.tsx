import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SignUpForm from "@/components/auth/signup-form"
import Link from "next/link"
import { getCurrentUser } from "@/lib/actions"
import { redirect } from "next/navigation"

interface SignUpPageProps {
  searchParams: {
    plan?: string
  }
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  // If user is already authenticated, redirect to admin
  const user = await getCurrentUser()
  if (user) {
    redirect("/admin")
  }

  const selectedPlan = searchParams.plan || "starter"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
          <CardDescription>
            {selectedPlan && selectedPlan !== "starter"
              ? `Create your account with the ${selectedPlan} plan`
              : "Create your AI Support Admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm selectedPlan={selectedPlan} />

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
