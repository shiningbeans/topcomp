import type { Metadata } from 'next'
import GamingPageClient from './client-page'

export const metadata: Metadata = {
    title: 'Gaming Laptops',
    description: 'Compare gaming laptop prices across 16+ retailers. Find the best deals on RTX and high-performance laptops.',
    openGraph: {
        title: 'Gaming Laptops | TopComp',
        description: 'Compare gaming laptop prices across 16+ retailers.',
    },
}

export default function GamingPage() {
    return <GamingPageClient />
}
