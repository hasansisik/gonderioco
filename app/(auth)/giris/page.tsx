import { LoginForm } from "@/components/login-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout imageSrc="/auth.png">
      <LoginForm />
    </AuthLayout>
  )
}
