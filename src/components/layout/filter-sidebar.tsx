"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Simple Accordion Component for internal use since we don't have Radix
function AccordionItem({
    title,
    children,
    defaultOpen = true
}: {
    title: string,
    children: React.ReactNode,
    defaultOpen?: boolean
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border py-4 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors"
            >
                {title}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <div className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                isOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
            )}>
                {children}
            </div>
        </div>
    )
}

function FilterCheckbox({ label, count, checked }: { label: string, count?: number, checked?: boolean }) {
    return (
        <label className="flex items-center gap-2 text-sm cursor-pointer group">
            <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" defaultChecked={checked} />
            <span className="group-hover:text-foreground text-muted-foreground transition-colors flex-1">{label}</span>
            {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
        </label>
    )
}

export function FilterSidebar() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" className="h-auto px-2 text-muted-foreground hover:text-foreground">
                    Clear all
                </Button>
            </div>

            <div className="space-y-1">
                {/* Price Range */}
                <AccordionItem title="Price Range">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Min ($)</span>
                            <Input type="number" placeholder="0" className="h-8" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Max ($)</span>
                            <Input type="number" placeholder="5000" className="h-8" />
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem title="Brand">
                    <div className="space-y-2">
                        <FilterCheckbox label="Apple" />
                        <FilterCheckbox label="Lenovo" />
                        <FilterCheckbox label="Dell" />
                        <FilterCheckbox label="HP" />
                        <FilterCheckbox label="ASUS" />
                        <FilterCheckbox label="Acer" />
                        <FilterCheckbox label="MSI" />
                        <FilterCheckbox label="Razer" />
                    </div>
                </AccordionItem>

                <AccordionItem title="Processor">
                    <div className="space-y-2">
                        <FilterCheckbox label="Apple M3" />
                        <FilterCheckbox label="Apple M3 Pro" />
                        <FilterCheckbox label="Apple M3 Max" />
                        <FilterCheckbox label="Intel Core i9" />
                        <FilterCheckbox label="Intel Core i7" />
                        <FilterCheckbox label="Intel Core i5" />
                        <FilterCheckbox label="AMD Ryzen 9" />
                        <FilterCheckbox label="AMD Ryzen 7" />
                    </div>
                </AccordionItem>

                <AccordionItem title="RAM" defaultOpen={false}>
                    <div className="space-y-2">
                        <FilterCheckbox label="8 GB" />
                        <FilterCheckbox label="16 GB" />
                        <FilterCheckbox label="32 GB" />
                        <FilterCheckbox label="64 GB+" />
                    </div>
                </AccordionItem>

                <AccordionItem title="Storage" defaultOpen={false}>
                    <div className="space-y-2">
                        <FilterCheckbox label="256 GB" />
                        <FilterCheckbox label="512 GB" />
                        <FilterCheckbox label="1 TB" />
                        <FilterCheckbox label="2 TB+" />
                    </div>
                </AccordionItem>

                <AccordionItem title="Screen Size" defaultOpen={false}>
                    <div className="space-y-2">
                        <FilterCheckbox label="13-inch" />
                        <FilterCheckbox label="14-inch" />
                        <FilterCheckbox label="15-inch" />
                        <FilterCheckbox label="16-inch" />
                        <FilterCheckbox label="17-inch+" />
                    </div>
                </AccordionItem>
            </div>
        </div>
    )
}
