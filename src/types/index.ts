export type Category = 'WORK' | 'GAMING' | 'APPLE'
export type DealRating = 'GREAT' | 'FAIR' | 'ABOVE_AVERAGE'

export interface RetailerPrice {
    retailer: string
    price: number
    originalPrice?: number
    discountPct?: number
    retailerUrl: string
    inStock: boolean
    lastChecked: string // ISO date string
}

export interface Laptop {
    id: string
    name: string
    slug: string
    brand: string
    model: string
    category: Category
    imageUrl?: string

    // CPU
    cpu: string
    cpuBrand: string
    cpuModel: string

    // GPU
    gpu: string
    gpuBrand: string

    // Memory & Storage
    ramGb: number
    ramType?: string // e.g. DDR5
    storageGb: number
    storageType: string // e.g. SSD
    storageInterface?: string // e.g. NVMe

    // Display
    screenSize: number
    screenRes: string
    displayType: string // IPS, OLED, etc.
    refreshRate: number
    touchscreen: boolean

    // Physical & Battery
    weightLbs: number
    batteryHours?: number

    // Software
    os: string

    // Meta
    releaseDate?: string

    // Reviews
    reviewScore?: number
    reviewCount?: number
    reviewSummary?: string

    // Pricing & Deals
    dealRating?: DealRating
    lowestPrice: number
    lowestRetailer: string
    prices: RetailerPrice[]
}
