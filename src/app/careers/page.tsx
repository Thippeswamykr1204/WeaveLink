import { Briefcase } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function CareersPage() {
  return (
    <PublicComingSoon
      icon={Briefcase}
      title="Careers at WeaveLink"
      description="We're not listing open roles just yet, but check back soon or reach out via our contact page."
    />
  );
}
