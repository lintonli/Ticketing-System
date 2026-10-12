import { toneClasses } from "../../utils/tickets";

interface PillProps {
  tone: string;
  children: string;
  className?: string;
}

export function Pill({ tone, children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClasses[tone] ?? toneClasses.slate} ${className}`}
    >
      {children}
    </span>
  );
}