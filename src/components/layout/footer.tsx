import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border bg-muted/40 py-12 text-sm">
            <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-lg font-bold tracking-tight text-primary">
                        TopComp
                    </Link>
                    <p className="text-muted-foreground leading-relaxed">
                        Top computers. Clear comparisons. Lowest prices.
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-muted-foreground">
                    <p className="mb-4">
                        TopComp tracks real-time prices from major retailers. We are not affiliated with any retailer.
                        Prices and availability are subject to change.
                    </p>
                    <p>
                        &copy; {currentYear} TopComp. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
