import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function PaymentsPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="Payments"
      description="Manage saved payment methods, view invoices, and track payment status across all your orders."
    />
  );
}