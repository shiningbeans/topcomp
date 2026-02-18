import { Shell } from "@/components/layout/shell";
import { LaptopCard, type LaptopProduct } from "@/components/shared/laptop-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search, TrendingDown, Star } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TopComp — Compare Laptop Prices Across Every Retailer',
  description: 'Compare laptop prices from 16+ retailers. Real-time deal tracking, spec comparison, and budget picks.',
  openGraph: {
    title: 'TopComp — Compare Laptop Prices Across Every Retailer',
    description: 'Compare laptop prices from 16+ retailers. Real-time deal tracking, spec comparison, and budget picks.',
  },
};

async function fetchLaptops(params: string): Promise<LaptopProduct[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/laptops?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((laptop: Record<string, unknown>) => ({
      id: laptop.id,
      name: laptop.name,
      slug: laptop.slug,
      imageUrl: laptop.imageUrl,
      specs: {
        cpu: laptop.cpu || '',
        ram: `${laptop.ramGb || 0} GB`,
        storage: `${laptop.storageGb || 0} GB ${laptop.storageType || ''}`.trim(),
        screen: `${laptop.screenSize || ''}" ${laptop.displayType || ''}`.trim(),
      },
      prices: (laptop.prices as Array<{ retailer: string; price: number }> || []).map(
        (p: { retailer: string; price: number }) => ({
          retailer: p.retailer,
          price: p.price,
        })
      ),
      dealRating: laptop.dealRating || 'FAIR',
      discountPct: laptop.discountPct,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const [deals, topRated] = await Promise.all([
    fetchLaptops('sort=deal&limit=4'),
    fetchLaptops('sort=rating&limit=4'),
  ]);

  const hasData = deals.length > 0 || topRated.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Shell>
        {/* Hero Section */}
        <section className="py-20 text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Every laptop. Every retailer. <br />
            <span className="text-primary">Side by side.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TopComp tracks real-time prices across 16+ retailers so you always find the best deal. No fake data, no guesswork — just accurate, up-to-date pricing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-lg" asChild>
              <Link href="/deals">See Top Deals</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
              <Link href="/search">Search Laptops</Link>
            </Button>
          </div>

          {/* Category Quick Links */}
          <div className="mt-12 p-6 rounded-xl border border-border bg-card shadow-sm text-left max-w-3xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/gaming">Gaming Laptops</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/work">Business</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/apple">MacBooks</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/budget-picks">Budget Picks</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/best-rated">Top Rated</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/deals">Deals</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/compare">Compare</Link>
              </Button>
              <Button variant="secondary" className="justify-start" asChild>
                <Link href="/search">Search</Link>
              </Button>
            </div>
          </div>
        </section>

        {hasData ? (
          <>
            {/* Top Deals Section */}
            {deals.length > 0 && (
              <section className="py-12 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Top Deals Right Now</h2>
                  <Link href="/deals" className="text-primary hover:underline flex items-center gap-1">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {deals.map((laptop) => (
                    <LaptopCard key={laptop.id} product={laptop} />
                  ))}
                </div>
              </section>
            )}

            {/* Highest Rated Section */}
            {topRated.length > 0 && (
              <section className="py-12 space-y-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Highest Rated</h2>
                  <Link href="/best-rated" className="text-primary hover:underline flex items-center gap-1">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topRated.map((laptop) => (
                    <LaptopCard key={`rated-${laptop.id}`} product={laptop} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* No Data State */
          <section className="py-16 text-center space-y-12 border-t border-border">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Price tracking is warming up</h2>
              <p className="text-muted-foreground">
                TopComp is actively indexing retailers and building its price database. Check back soon for real-time laptop deals and comparisons.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Real-Time Search</h3>
                <p className="text-sm text-muted-foreground">Search across 16+ retailers for the laptop you need.</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Deal Tracking</h3>
                <p className="text-sm text-muted-foreground">Automatic deal detection with price history and alerts.</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card">
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Spec Comparison</h3>
                <p className="text-sm text-muted-foreground">Side-by-side specs and pricing for informed decisions.</p>
              </div>
            </div>
          </section>
        )}
      </Shell>
    </div>
  );
}
