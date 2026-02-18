import { Star } from 'lucide-react'

interface ReviewSummaryProps {
    score?: number
    count?: number
    summary?: string
}

export function ReviewSummary({ score, count, summary }: ReviewSummaryProps) {
    if (!score) return null

    // Calculate stars (0-5 scale based on 0-100 score)
    const starScore = (score / 20)

    return (
        <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-4 min-w-[100px]">
                    <span className="text-4xl font-bold">{score}</span>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Score</span>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">Expert Review Score</h3>
                        {count && (
                            <span className="text-neutral-400 text-sm">
                                based on {count} reviews
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(starScore) ? 'fill-current' : 'text-neutral-700 fill-neutral-700'
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-neutral-300 font-medium">{starScore.toFixed(1)}/5</span>
                    </div>

                    {summary && (
                        <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl">
                            {summary}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
