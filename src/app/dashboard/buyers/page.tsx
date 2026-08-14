import { Users } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function BuyersPage() {
  return (
    <ComingSoon
      icon={Users}
      title="Buyers"
      description="View buyers who've ordered from you, their order history, and reach out directly to grow repeat business."
      requireRole="supplier"
    />
  );
}