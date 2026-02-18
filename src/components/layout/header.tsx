"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Work", href: "/work" },
    { label: "Gaming", href: "/gaming" },
    { label: "Apple", href: "/apple" },
    { label: "Top Deals", href: "/deals" },
    { label: "Budget Picks", href: "/budget" },
    { label: "Best Rated", href: "/best-rated" },
];

function SearchBar() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    return (
        <form action="/search" className="relative w-full max-w-sm" role="search" aria-label="Site search">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    name="q"
                    placeholder="Search laptops..."
                    className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </form>
    );
}

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-primary">TopComp</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname.startsWith(item.href)
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Search & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <Suspense fallback={<div className="w-[200px] h-9 bg-muted rounded-md" />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    <button
                        className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background px-4 py-4 shadow-lg animate-accordion-down">
                    <div className="mb-4">
                        <Suspense fallback={<div className="w-full h-9 bg-muted rounded-md" />}>
                            <SearchBar />
                        </Suspense>
                    </div>
                    <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary block py-2 border-l-2 pl-3",
                                    pathname.startsWith(item.href)
                                        ? "text-primary border-primary bg-primary-50"
                                        : "text-muted-foreground border-transparent"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
