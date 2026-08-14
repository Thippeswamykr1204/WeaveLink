import { Mail } from "lucide-react";
import { PublicComingSoon } from "@/components/PublicComingSoon";

export default function ContactPage() {
  return (
    <PublicComingSoon
      icon={Mail}
      title="Contact Us"
      description="A dedicated contact form is on the way. In the meantime, reach the team at hello@weavelink.com."
    />
  );
}
