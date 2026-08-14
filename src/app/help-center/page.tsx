import { LifeBuoy } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function HelpCenterPage() {
  return (
    <PublicComingSoon
      icon={LifeBuoy}
      title="Help Center"
      description="FAQs and support articles for buyers and suppliers are coming soon."
    />
  );
}
