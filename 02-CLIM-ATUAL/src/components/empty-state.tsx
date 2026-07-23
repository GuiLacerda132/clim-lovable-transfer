import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E6ECE8] bg-white px-6 text-center ${
        compact ? "py-8" : "py-12"
      }`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F8F5] ring-1 ring-[#C7962D]/30 text-[#C7962D]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-bold text-[#07553F]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

