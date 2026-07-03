import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams.callbackUrl || "/admin";
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
