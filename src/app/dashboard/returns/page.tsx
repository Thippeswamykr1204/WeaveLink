import { RotateCcw } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function ReturnsPage() {
  return (
    <ComingSoon
      icon={RotateCcw}
      title="Returns"
      description="Manage return requests, approvals, and refunds for orders that don't meet buyer expectations."
      requireRole="supplier"
    />
  );
}