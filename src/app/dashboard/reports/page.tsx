import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Reports"
      description="Detailed spending, supplier performance, and sourcing analytics to help you plan future purchases."
      requireRole="buyer"
    />
  );
}