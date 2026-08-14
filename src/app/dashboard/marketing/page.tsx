import { Megaphone } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function MarketingToolsPage() {
  return (
    <ComingSoon
      icon={Megaphone}
      title="Marketing Tools"
      description="Promote your listings with featured placements, discounts, and campaigns to reach more buyers."
      requireRole="supplier"
    />
  );
}