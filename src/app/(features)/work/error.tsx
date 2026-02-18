'use client'

import { useEffect } from 'react'
import { FeatureCard } from '@/components/shared/feature-card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // TODO: Send to error reporting service
    }, [error])

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-lg">
                <FeatureCard
                    title="Something went wrong"
                    description={error.message || "We couldn't load the laptops. Please try again."}
                    icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
                    error={error.message}
                />
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={reset}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary-600)' }}
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    )
}
