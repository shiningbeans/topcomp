import type { Metadata } from 'next'
import WorkPageClient from './client-page'

export const metadata: Metadata = {
    title: 'Work Laptops',
    description: 'Compare best laptops for work and productivity. Find deals on ThinkPads, MacBooks, and Dell XPS.',
    openGraph: {
        title: 'Work Laptops | TopComp',
        description: 'Compare best laptops for work and productivity.',
    },
}

export default function WorkPage() {
    return <WorkPageClient />
}
