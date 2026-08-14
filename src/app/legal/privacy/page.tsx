import { ShieldCheck } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function PrivacyPolicyPage() {
  return (
    <PublicComingSoon
      icon={ShieldCheck}
      title="Privacy Policy"
      description="Our full privacy policy is being finalized and will be published here soon."
    />
  );
}
