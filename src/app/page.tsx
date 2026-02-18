import { Shell } from "@/components/layout/shell";
import { LaptopCard, type LaptopProduct } from "@/components/shared/laptop-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TopComp — Compare Laptop Prices Across Every Retailer',
  description: 'Compare laptop prices from 16+ retailers. Real-time deal tracking, spec comparison, and budget picks.',
};

// Mock Data for UI Foundation
const MOCK_LAPTOPS: LaptopProduct[] = [
  {
    id: "1",
    name: "MacBook Pro 14 M3 Pro",
    slug: "macbook-pro-14-m3-pro",
    specs: { cpu: "Apple M3 Pro", ram: "18 GB", storage: "512 GB", screen: "14.2 Liquid Retina XDR" },
    prices: [{ retailer: "Amazon", price: 1799.00 }, { retailer: "Best Buy", price: 1849.00 }, { retailer: "Apple", price: 1999.00 }],
    dealRating: "GREAT",
    discountPct: 10
  },
  {
    id: "2",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    slug: "lenovo-thinkpad-x1-carbon",
    specs: { cpu: "Intel Core i7-1355U", ram: "16 GB", storage: "512 GB SSD", screen: "14 IPS" },
    prices: [{ retailer: "Lenovo", price: 1399.00 }, { retailer: "Amazon", price: 1450.00 }],
    dealRating: "FAIR",
    discountPct: 5
  },
  {
    id: "3",
    name: "Dell XPS 15 9530",
    slug: "dell-xps-15",
    specs: { cpu: "Intel Core i9-13900H", ram: "32 GB", storage: "1 TB SSD", screen: "15.6 OLED" },
    prices: [{ retailer: "Dell", price: 2199.00 }, { retailer: "Best Buy", price: 2299.00 }],
    dealRating: "ABOVE_AVERAGE",
  },
  {
    id: "4",
    name: "ASUS ROG Zephyrus G14",
    slug: "asus-rog-zephyrus-g14",
    specs: { cpu: "AMD Ryzen 9 7940HS", ram: "16 GB", storage: "1 TB SSD", screen: "14 QHD+ 165Hz" },
    prices: [{ retailer: "Best Buy", price: 1099.99 }],
    dealRating: "GREAT",
    discountPct: 25
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Shell>
        {/* Hero Section */}
        <section className="py-20 text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Every laptop. Every retailer. <br />
            <span className="text-primary">Side by side.</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-lg" asChild>
              <Link href="/deals">See Top Deals</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
              <Link href="/work">Browse Work Laptops</Link>
            </Button>
          </div>

          {/* Interactive Selector Mock (Feature Agent will implement full logic) */}
          <div className="mt-12 p-6 rounded-xl border border-border bg-card shadow-sm text-left max-w-3xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Quick Finder</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="secondary" className="justify-start">Gaming Laptops</Button>
              <Button variant="secondary" className="justify-start">Under $500</Button>
              <Button variant="secondary" className="justify-start">Business</Button>
              <Button variant="secondary" className="justify-start">Students</Button>
              <Button variant="secondary" className="justify-start">MacBooks</Button>
              <Button variant="secondary" className="justify-start">Touchscreen</Button>
              <Button variant="secondary" className="justify-start">Long Battery</Button>
              <Button variant="secondary" className="justify-start">Lightweight</Button>
            </div>
          </div>
        </section>

        {/* Top Deals Section */}
        <section className="py-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Top Deals Right Now</h2>
            <Link href="/deals" className="text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_LAPTOPS.map((laptop) => (
              <LaptopCard key={laptop.id} product={laptop} />
            ))}
          </div>
        </section>

        {/* Best Value Section */}
        <section className="py-12 space-y-6 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Best Value Picks</h2>
            <Link href="/budget" className="text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_LAPTOPS.slice(0, 3).map((laptop) => (
              <LaptopCard key={`value-${laptop.id}`} product={laptop} />
            ))}
            {/* Skeleton Example */}
            <LaptopCard isLoading />
          </div>
        </section>

        {/* Highest Rated Section */}
        <section className="py-12 space-y-6 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Highest Rated</h2>
            <Link href="/best-rated" className="text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_LAPTOPS.slice(1, 4).map((laptop) => (
              <LaptopCard key={`rated-${laptop.id}`} product={laptop} />
            ))}
            <LaptopCard isLoading />
          </div>
        </section>
      </Shell>
    </div>
  );
}
