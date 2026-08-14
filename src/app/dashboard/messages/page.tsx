import { MessageSquare } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function MessagesPage() {
  return (
    <ComingSoon
      icon={MessageSquare}
      title="Messages"
      description="Chat directly with suppliers about orders, samples, and custom requirements — all in one inbox."
    />
  );
}