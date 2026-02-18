'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

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
                <div className="bg-red-50 p-4 rounded-full">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Could not load comparison</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                We encountered an error while loading the comparison table.
            </p>
            <Button onClick={() => reset()}>
                Try again
            </Button>
        </div>
    )
}
