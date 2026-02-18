"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ComparisonTrayProps {
    count: number;
    onClear: () => void;
    className?: string;
}

export function ComparisonTray({ count, onClear, className }: ComparisonTrayProps) {
    if (count === 0) return null;

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out",
            count > 0 ? "translate-y-0" : "translate-y-full",
            className
        )}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                        Compare ({count} of 3)
                    </span>
                    <button
                        onClick={onClear}
                        className="text-xs text-muted-foreground hover:text-primary hover:underline"
                        aria-label="Clear all laptops from comparison"
                    >
                        Clear all
                    </button>
                </div>

                <Button
                    disabled={count < 2}
                    className={cn(count < 2 && "opacity-50 cursor-not-allowed")}
                >
                    <Link href="/compare" className={cn(count < 2 && "pointer-events-none")}>
                        Compare Now
                    </Link>
                </Button>
            </div>
        </div>
    )
}
