import { AccountLayout } from "./AccountLayout";
import { UserRole } from "@/lib/store";

export function ComingSoon({
  icon: Icon,
  title,
  description,
  requireRole,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  requireRole?: UserRole;
}) {
  return (
    <AccountLayout requireRole={requireRole}>
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/12 text-terracotta-dark">
          <Icon size={26} />
        </div>
        <h1 className="mb-1.5 font-serif text-2xl">{title}</h1>
        <span className="mb-3 inline-block rounded-full bg-cream-2 px-3 py-1 text-xs font-semibold text-ink/70">
          Coming Soon
        </span>
        <p className="max-w-sm text-sm text-muted">{description}</p>
      </div>
    </AccountLayout>
  );
}