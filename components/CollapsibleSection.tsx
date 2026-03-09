"use client";

import { useEffect, useState, type ReactNode } from "react";

interface CollapsibleSectionProps {
  step?: number;
  title: string;
  indicator?: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. When provided, overrides internal state. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  step,
  title,
  indicator,
  defaultOpen = true,
  open: controlledOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Sync internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) setInternalOpen(controlledOpen);
  }, [isControlled, controlledOpen]);

  const toggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="group flex w-full items-center gap-3 py-1 [touch-action:manipulation]"
        aria-expanded={open}
      >
        {step != null && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BA9D95] font-poppins text-[11px] font-medium text-white">
            {step}
          </span>
        )}
        <span className="font-poppins text-[13px] uppercase tracking-[1.3px] text-[#282828]">
          {title}
        </span>
        {indicator && (
          <span className="font-poppins text-[12px] text-[#BA9D95]">
            {indicator}
          </span>
        )}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-auto shrink-0 text-[#282828]/20 transition-transform duration-300 ease-out group-hover:text-[#282828]/40 ${
            open ? "" : "-rotate-90"
          }`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
