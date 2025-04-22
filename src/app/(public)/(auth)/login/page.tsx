import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex h-fit flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
