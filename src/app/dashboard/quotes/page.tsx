import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function QuotesPage() {
  return (
    <ComingSoon
      icon={FileText}
      title="Quotes"
      description="Request and track custom fabric quotes from suppliers, compare offers, and convert them straight into orders."
    />
  );
}