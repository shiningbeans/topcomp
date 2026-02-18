import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface ShellProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
}

export function Shell({ children, sidebar }: ShellProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 container mx-auto px-4 flex gap-8 py-8">
                {sidebar && (
                    <aside className="hidden lg:block w-[280px] shrink-0">
                        {/* Sticky sidebar */}
                        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                            {sidebar}
                        </div>
                    </aside>
                )}
                <main className="flex-1 w-full min-w-0">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}
