import type { Metadata } from 'next'
import ApplePageClient from './client-page'

export const metadata: Metadata = {
    title: 'Apple Laptops',
    description: 'Find the best prices on MacBook Air and MacBook Pro. Compare deals across authorized Apple retailers.',
    openGraph: {
        title: 'Apple Laptops | TopComp',
        description: 'Find the best prices on MacBook Air and MacBook Pro.',
    },
}

export default function ApplePage() {
    return <ApplePageClient />
}
