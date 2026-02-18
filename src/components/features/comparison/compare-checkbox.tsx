'use client'

import { useComparison } from '@/hooks/use-comparison'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface CompareCheckboxProps {
    slug: string
    className?: string
}

export function CompareCheckbox({ slug, className }: CompareCheckboxProps) {
    const { isInComparison, addToCompare, removeFromCompare, isAtLimit } = useComparison()
    const isChecked = isInComparison(slug)
    const isDisabled = !isChecked && isAtLimit

    return (
        <div className={cn("flex items-center space-x-2", className)} onClick={(e) => e.stopPropagation()}>
            <Checkbox
                id={`compare-${slug}`}
                checked={isChecked}
                disabled={isDisabled}
                onCheckedChange={(checked: boolean | 'indeterminate') => {
                    if (checked) {
                        addToCompare(slug)
                    } else {
                        removeFromCompare(slug)
                    }
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-white/50 bg-white/20 backdrop-blur-sm"
            />
            <label
                htmlFor={`compare-${slug}`}
                className="text-xs font-medium text-white shadow-black/50 drop-shadow-md cursor-pointer select-none hidden sm:block"
            >
                Compare
            </label>
        </div>
    )
}
