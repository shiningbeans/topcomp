import { Laptop } from '@/types'
import { Check, X } from 'lucide-react'

interface SpecRowProps {
    label: string
    value: string | number | boolean | undefined
    isMono?: boolean
}

function SpecRow({ label, value, isMono = false }: SpecRowProps) {
    if (value === undefined || value === null) return null

    let displayValue: React.ReactNode = value

    if (typeof value === 'boolean') {
        displayValue = value ? (
            <Check className="h-5 w-5 text-green-600" />
        ) : (
            <X className="h-5 w-5 text-neutral-400" />
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors">
            <dt className="text-sm font-medium text-neutral-500 sm:col-span-1">{label}</dt>
            <dd className={`text-sm text-neutral-900 sm:col-span-2 ${isMono ? 'font-mono' : ''}`}>
                {displayValue}
            </dd>
        </div>
    )
}

interface SpecTableProps {
    laptop: Laptop
}

export function SpecTable({ laptop }: SpecTableProps) {
    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
                <h3 className="text-lg font-semibold text-neutral-900">Technical Specifications</h3>
            </div>
            <div className="p-6">
                <dl className="divide-y divide-neutral-100">
                    {/* Core Specs */}
                    <div className="mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Performance</h4>
                        <SpecRow label="Processor" value={`${laptop.cpu} (${laptop.cpuBrand} ${laptop.cpuModel})`} isMono />
                        <SpecRow label="Graphics" value={`${laptop.gpu} (${laptop.gpuBrand})`} isMono />
                        <SpecRow label="Memory" value={`${laptop.ramGb} GB ${laptop.ramType || ''}`} isMono />
                        <SpecRow label="Storage" value={`${laptop.storageGb} GB ${laptop.storageType} ${laptop.storageInterface || ''}`} isMono />
                        <SpecRow label="Operating System" value={laptop.os} />
                    </div>

                    {/* Display */}
                    <div className="mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Display</h4>
                        <SpecRow label="Screen Size" value={`${laptop.screenSize}"`} isMono />
                        <SpecRow label="Resolution" value={laptop.screenRes} isMono />
                        <SpecRow label="Display Type" value={laptop.displayType} />
                        <SpecRow label="Refresh Rate" value={`${laptop.refreshRate} Hz`} isMono />
                        <SpecRow label="Touchscreen" value={laptop.touchscreen} />
                    </div>

                    {/* Physical & Battery */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Design & Battery</h4>
                        <SpecRow label="Weight" value={`${laptop.weightLbs} lbs`} isMono />
                        <SpecRow label="Battery Life" value={laptop.batteryHours ? `Up to ${laptop.batteryHours} hours` : undefined} />
                        <SpecRow label="Release Date" value={laptop.releaseDate ? new Date(laptop.releaseDate).toLocaleDateString() : undefined} />
                        <SpecRow label="Model Number" value={laptop.model} isMono />
                    </div>
                </dl>
            </div>
        </div>
    )
}
