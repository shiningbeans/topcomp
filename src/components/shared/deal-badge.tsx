import { cn } from "@/lib/utils";

export type DealRating = "GREAT" | "FAIR" | "ABOVE_AVERAGE";

interface DealBadgeProps {
    rating: DealRating;
    className?: string;
}

const RATING_CONFIG = {
    GREAT: {
        label: "Great Price",
        // Using CSS variables from globals.css
        className: "bg-deal-great text-white",
    },
    FAIR: {
        label: "Fair Price",
        className: "bg-deal-fair text-white",
    },
    ABOVE_AVERAGE: {
        label: "Above Average",
        className: "bg-deal-above-average text-white",
    },
};

export function DealBadge({ rating, className }: DealBadgeProps) {
    const config = RATING_CONFIG[rating];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-wider",
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}
