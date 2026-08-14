import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function PayoutsPage() {
  return (
    <ComingSoon
      icon={Wallet}
      title="Payouts"
      description="Track settlement schedules, payout history, and bank transfer status for your completed orders."
      requireRole="supplier"
    />
  );
}