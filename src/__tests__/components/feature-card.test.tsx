import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureCard } from '@/components/shared/feature-card'
import { Star } from 'lucide-react'

describe('FeatureCard', () => {
  const defaultProps = {
    title: 'Test Feature',
    description: 'A test description',
    icon: <Star data-testid="icon" />,
  }

  it('renders success state with title and description', () => {
    render(<FeatureCard {...defaultProps} />)
    expect(screen.getByText('Test Feature')).toBeInTheDocument()
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  it('renders loading skeleton when isLoading', () => {
    const { container } = render(<FeatureCard {...defaultProps} isLoading />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(screen.queryByText('Test Feature')).not.toBeInTheDocument()
  })

  it('renders error state with alert role', () => {
    render(<FeatureCard {...defaultProps} error="Network timeout" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Network timeout')).toBeInTheDocument()
  })

  it('renders empty state with action prompt', () => {
    render(<FeatureCard {...defaultProps} isEmpty />)
    expect(screen.getByText('No features yet')).toBeInTheDocument()
  })
})
