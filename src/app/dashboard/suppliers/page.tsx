import { Users } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function PreferredSuppliersPage() {
  return (
    <ComingSoon
      icon={Users}
      title="Preferred Suppliers"
      description="Save suppliers you work with often for faster reordering, direct messaging, and priority quote requests."
      requireRole="buyer"
    />
  );
}