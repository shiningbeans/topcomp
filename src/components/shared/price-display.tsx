import { cn } from "@/lib/utils";

interface PriceDisplayProps {
    price: number;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const SIZE_CLASSES = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
};

export function PriceDisplay({ price, size = "md", className }: PriceDisplayProps) {
    return (
        <span
            className={cn(
                "font-mono font-medium tabular-nums tracking-tight",
                SIZE_CLASSES[size],
                className
            )}
        >
            ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
    );
}
