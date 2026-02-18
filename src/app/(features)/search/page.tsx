import type { Metadata } from 'next'
import SearchPageClient from './client-page'

export const metadata: Metadata = {
    title: 'Search Laptops',
    description: 'Search for specific laptops, brands, or specs. Compare prices to find the best deal.',
    openGraph: {
        title: 'Search Laptops | TopComp',
        description: 'Search for specific laptops, brands, or specs.',
    },
}

export default function SearchPage() {
    return <SearchPageClient />
}
