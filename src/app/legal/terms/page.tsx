import { FileText } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function TermsOfServicePage() {
  return (
    <PublicComingSoon
      icon={FileText}
      title="Terms of Service"
      description="Our full terms of service are being finalized and will be published here soon."
    />
  );
}
