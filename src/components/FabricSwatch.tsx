import { cn } from "@/lib/utils";

export function FabricSwatch({
  gradient,
  image,
  tint,
  className,
  swirl = true,
  children,
}: {
  gradient?: string;
  image?: string;
  /** Hex color used to recolor a neutral/white `image` via mix-blend-mode. Ignored when `image` isn't set. */
  tint?: string;
  className?: string;
  swirl?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-cover bg-center", className)}
      style={{ backgroundImage: image ? `url(${image})` : gradient }}
    >
      {image && tint && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: tint, mixBlendMode: "color" }}
        />
      )}
      {swirl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 6px)",
          }}
        />
      )}
      {children}
    </div>
  );
}