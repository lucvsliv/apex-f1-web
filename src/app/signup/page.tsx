// 💡 LoginForm 대신 우리가 새로 만든 SignupForm을 임포트합니다.
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SignupForm />
            </div>
        </div>
    );
}