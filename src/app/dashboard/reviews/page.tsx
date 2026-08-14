import { Star } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function ReviewsPage() {
  return (
    <ComingSoon
      icon={Star}
      title="Reviews"
      description="See buyer ratings and feedback on your products and respond to build trust on the marketplace."
      requireRole="supplier"
    />
  );
}