import { Laptop } from '@/types'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Check, Minus } from 'lucide-react'
import { CompareCheckbox } from '@/components/features/comparison/compare-checkbox'

export const metadata: Metadata = {
    title: 'Compare Laptops - TopComp',
    description: 'Side-by-side comparison of laptop specifications and prices.',
}

export const dynamic = 'force-dynamic';

async function getLaptops(slugs: string[]): Promise<Laptop[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    if (slugs.length === 0) return []

    try {
        const promises = slugs.map(slug =>
            fetch(`${baseUrl}/api/laptops/${slug}`, { next: { revalidate: 60 } })
                .then(r => r.ok ? r.json() : null)
        )
        const results = await Promise.all(promises)
        return results.map(r => r?.data).filter(Boolean)
    } catch (error) {
        // TODO: Send to error reporting service
        return []
    }
}

interface PageProps {
    searchParams: Promise<{ compare?: string }>
}

export default async function ComparePage({ searchParams }: PageProps) {
    const { compare } = await searchParams
    const slugs = compare ? compare.split(',').filter(Boolean) : []
    const laptops = await getLaptops(slugs)

    if (laptops.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">No laptops selected</h1>
                <p className="text-neutral-500 mb-8">Select up to 3 laptops to compare them side-by-side.</p>
                <Button asChild>
                    <Link href="/">Browse Laptops</Link>
                </Button>
            </div>
        )
    }

    // Helper to render a row
    const renderRow = (label: string, renderVal: (l: Laptop) => React.ReactNode, highlightBest?: 'high' | 'low') => {
        return (
            <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                <th className="py-4 px-4 text-left text-sm font-medium text-neutral-500 w-1/4 align-top">
                    {label}
                </th>
                {laptops.map(laptop => (
                    <td key={laptop.id} className="py-4 px-4 text-sm text-neutral-900 align-top">
                        {renderVal(laptop)}
                    </td>
                ))}
                {/* Fill empty columns if < 3 */}
                {Array.from({ length: 3 - laptops.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="py-4 px-4 bg-neutral-50/30"></td>
                ))}
            </tr>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl overflow-x-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">Compare Laptops</h1>

            <div className="min-w-[800px]">
                <table className="w-full table-fixed" aria-label="Side-by-side laptop comparison">
                    <thead>
                        <tr>
                            <th className="w-1/4"></th>
                            {laptops.map(laptop => (
                                <th key={laptop.id} className="w-1/4 px-4 pb-6 text-left align-top">
                                    <div className="relative group">
                                        <div className="aspect-[4/3] bg-white rounded-lg border border-neutral-200 p-4 mb-4 flex items-center justify-center relative">
                                            {laptop.imageUrl ? (
                                                <Image
                                                    src={laptop.imageUrl}
                                                    alt={laptop.name}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-100" />
                                            )}
                                        </div>
                                        <Link href={`/laptop/${laptop.slug}`} className="hover:text-primary transition-colors block mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{laptop.name}</h3>
                                        </Link>
                                        <div className="text-xl font-bold font-mono text-primary">
                                            ${laptop.lowestPrice.toLocaleString()}
                                        </div>
                                    </div>
                                </th>
                            ))}
                            {Array.from({ length: 3 - laptops.length }).map((_, i) => (
                                <th key={`head-empty-${i}`} className="w-1/4 px-4 pb-6 text-center align-middle text-neutral-400">
                                    <div className="border-2 border-dashed border-neutral-200 rounded-xl aspect-[4/3] flex flex-col items-center justify-center">
                                        <span className="text-sm mb-2">Add another laptop</span>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/">Browse</Link>
                                        </Button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {/* Specs */}
                        {renderRow('Processor', l => <><div className="font-semibold">{l.cpuModel}</div><div className="text-neutral-500 text-xs">{l.cpuBrand}</div></>)}
                        {renderRow('Graphics', l => <><div className="font-semibold">{l.gpu}</div><div className="text-neutral-500 text-xs">{l.gpuBrand}</div></>)}
                        {renderRow('Memory', l => `${l.ramGb} GB`)}
                        {renderRow('Storage', l => `${l.storageGb} GB ${l.storageType}`)}

                        {/* Display */}
                        {renderRow('Screen', l => `${l.screenSize} inch`)}
                        {renderRow('Resolution', l => l.screenRes)}
                        {renderRow('Display Type', l => l.displayType)}
                        {renderRow('Refresh Rate', l => `${l.refreshRate} Hz`)}
                        {renderRow('Touchscreen', l => l.touchscreen ? <Check className="w-5 h-5 text-green-500" /> : <Minus className="w-5 h-5 text-neutral-300" />)}

                        {/* Design */}
                        {renderRow('Weight', l => `${l.weightLbs} lbs`)}
                        {renderRow('OS', l => l.os)}
                        {renderRow('Battery', l => l.batteryHours ? `${l.batteryHours} hours` : 'N/A')}

                        {/* Review */}
                        {renderRow('Review Score', l => l.reviewScore ? <span className="font-bold text-neutral-900">{l.reviewScore}/100</span> : 'N/A')}

                        {/* Action */}
                        {renderRow('', l => (
                            <Button className="w-full" asChild>
                                <Link href={`/laptop/${l.slug}`}>View Details</Link>
                            </Button>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
