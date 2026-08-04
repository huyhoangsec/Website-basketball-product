import { render, screen } from '@testing-library/react'
import StatsCard from '../StatsCard'

describe('StatsCard Component', () => {
  it('renders the label and value correctly', () => {
    render(
      <StatsCard
        icon={<span data-testid="icon">Icon</span>}
        label="Total Students"
        value="120"
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
    )

    expect(screen.getByText('Total Students')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders the trend correctly if provided', () => {
    render(
      <StatsCard
        icon={<span data-testid="icon">Icon</span>}
        label="Revenue"
        value="$5000"
        trend={{ value: "+10%", isUp: true }}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
    )

    expect(screen.getByText('+10%')).toBeInTheDocument()
    // It should render the ArrowUpRight icon inside since isUp is true
  })
})
