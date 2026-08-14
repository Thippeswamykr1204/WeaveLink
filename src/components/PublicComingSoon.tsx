import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PublicComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
        <Icon size={26} />
      </div>
      <h1 className="mb-1.5 font-serif text-2xl">{title}</h1>
      <span className="mb-3 inline-block rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-ink/70">
        Coming Soon
      </span>
      <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
      <Link href="/" className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
        <ArrowLeft size={15} /> Back to Home
      </Link>
    </div>
  );
}
