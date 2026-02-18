// REFERENCE IMPLEMENTATION — This component demonstrates the patterns all components must follow.
// Agents: study this file before building any new component. Match these patterns exactly.
// See .gemini/antigravity/brain/ui-rules.md for the full rules.
'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  isLoading?: boolean
  error?: string | null
  isEmpty?: boolean
}

export function FeatureCard({
  title,
  description,
  icon,
  isLoading = false,
  error = null,
  isEmpty = false,
}: FeatureCardProps): React.ReactElement {
  if (isLoading) {
    return (
      <div
        className="rounded-lg border p-6 animate-pulse"
        style={{
          backgroundColor: 'var(--color-surface-muted)',
          borderColor: 'var(--color-surface-border)',
        }}
      >
        <div className="h-10 w-10 rounded-md bg-current opacity-10" />
        <div className="mt-4 h-5 w-3/4 rounded bg-current opacity-10" />
        <div className="mt-2 h-4 w-full rounded bg-current opacity-10" />
        <div className="mt-1 h-4 w-2/3 rounded bg-current opacity-10" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-lg border p-6 flex items-start gap-3"
        role="alert"
        style={{
          backgroundColor: 'var(--color-surface-card)',
          borderColor: 'var(--color-semantic-error)',
        }}
      >
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: 'var(--color-semantic-error)' }} aria-hidden="true" />
        <div>
          <p className="font-medium" style={{ color: 'var(--color-surface-foreground)' }}>
            Something went wrong
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-surface-mutedForeground)' }}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div
        className="rounded-lg border border-dashed p-6 text-center"
        style={{
          backgroundColor: 'var(--color-surface-card)',
          borderColor: 'var(--color-surface-border)',
        }}
      >
        <div className="mx-auto h-10 w-10 rounded-md opacity-30" style={{ backgroundColor: 'var(--color-primary-500)' }} />
        <p className="mt-3 font-medium" style={{ color: 'var(--color-surface-foreground)' }}>No features yet</p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-surface-mutedForeground)' }}>
          Add your first feature to get started.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
      className="rounded-lg border p-6 transition-shadow"
      style={{
        backgroundColor: 'var(--color-surface-card)',
        borderColor: 'var(--color-surface-border)',
      }}
      whileHover={{
        boxShadow: 'var(--shadow-md)',
        scale: 1.02,
      }}
      tabIndex={0}
    >
      <div
        className="h-10 w-10 rounded-md flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-primary-50)' }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3
        className="mt-4 font-semibold"
        style={{
          color: 'var(--color-surface-foreground)',
          fontSize: 'var(--typography-scale-lg)',
        }}
      >
        {title}
      </h3>
      <p
        className="mt-2 leading-relaxed"
        style={{
          color: 'var(--color-surface-mutedForeground)',
          fontSize: 'var(--typography-scale-sm)',
        }}
      >
        {description}
      </p>
    </motion.div>
  )
}
