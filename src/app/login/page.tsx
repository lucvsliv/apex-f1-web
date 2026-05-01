import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm
                    title="다시 오신 것을 환영합니다"
                />
            </div>
        </div>
    );
}