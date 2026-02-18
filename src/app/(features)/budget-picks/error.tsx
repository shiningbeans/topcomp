'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // TODO: error reporting
    }, [error])

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="flex justify-center mb-6">
                <div className="bg-neutral-100 p-4 rounded-full">
                    <AlertTriangle className="w-12 h-12 text-neutral-500" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Could not load budget picks</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                We're having trouble identifying the best values right now.
            </p>
            <Button onClick={() => reset()}>
                Try again
            </Button>
        </div>
    )
}
