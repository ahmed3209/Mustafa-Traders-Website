import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  return <LoginForm callbackUrl={searchParams.callbackUrl || "/admin"} />;
}
