import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/auth/login-form"
import Link from "next/link"
import { getCurrentUser } from "@/lib/actions"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // If user is already authenticated, redirect to admin
  const user = await getCurrentUser()
  if (user) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your AI Support Admin account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
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
