import { MembershipSuccessView } from "@/components/membership-success-view";

export default function MembershipSuccessPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-xl">
                <MembershipSuccessView />
            </div>
        </div>
    );
}