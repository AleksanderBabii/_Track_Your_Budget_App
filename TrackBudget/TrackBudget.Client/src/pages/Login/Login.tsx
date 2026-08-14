import { AuthLayout } from "../../components/auth/AuthLayout/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm/LoginForm";

export function Login() {
  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Please enter your credentials to log in."
      footerText="Don't have an account?"
      footerLink="Sign up"
      footerLinkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}
