"use client";

import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 p-4", className)}>
      <span className="h-2 w-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 bg-neutral-500 rounded-full animate-bounce" />
    </div>
  );
}
