import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Card } from './Card'

describe('Card', () => {
  // 1. Renders without crashing
  it('renders without crashing', () => {
    render(<Card>Hello</Card>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  // 2. Renders children correctly
  it('renders children content', () => {
    render(<Card><span>Card content</span></Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  // 3. Each variant applies a distinct class
  it.each([
    ['primary', 'border-indigo-200'],
    ['light', 'border-gray-200'],
    ['dark', 'bg-gray-800'],
    ['warning', 'border-amber-200'],
    ['danger', 'border-red-200'],
    ['success', 'border-green-200'],
  ] as const)('variant "%s" applies class "%s"', (variant, expectedClass) => {
    const { container } = render(<Card variant={variant}>content</Card>)
    expect(container.firstChild).toHaveClass(expectedClass)
  })

  // 4. Each size applies the correct class
  it.each([
    ['sm', 'p-3'],
    ['md', 'p-5'],
    ['lg', 'p-7'],
  ] as const)('size "%s" applies class "%s"', (size, expectedClass) => {
    const { container } = render(<Card size={size}>content</Card>)
    expect(container.firstChild).toHaveClass(expectedClass)
  })

  // 5. Disabled state: correct classes and aria attribute
  it('applies opacity and cursor classes when disabled', () => {
    const { container } = render(<Card disabled>content</Card>)
    expect(container.firstChild).toHaveClass('opacity-50')
    expect(container.firstChild).toHaveClass('cursor-not-allowed')
    expect(container.firstChild).toHaveAttribute('aria-disabled', 'true')
  })

  // 6. Disabled state: click is suppressed
  it('does not fire onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Card disabled onClick={handleClick}>content</Card>)
    // pointer-events-none prevents real DOM clicks; simulate via userEvent anyway
    await userEvent.click(screen.getByText('content'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
