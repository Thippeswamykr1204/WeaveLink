import { Newspaper } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function BlogPage() {
  return (
    <PublicComingSoon
      icon={Newspaper}
      title="WeaveLink Blog"
      description="Sourcing tips, supplier spotlights, and industry trends. Our first posts are on the way."
    />
  );
}
