import OnboardingFlow from "@/components/auth/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-blue-dark">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <OnboardingFlow />
      </div>
    </div>
  );
}
