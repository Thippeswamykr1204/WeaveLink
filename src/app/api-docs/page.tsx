import { Code2 } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function ApiDocsPage() {
  return (
    <PublicComingSoon
      icon={Code2}
      title="API Docs"
      description="Public API documentation for integrating with WeaveLink is coming soon."
    />
  );
}
