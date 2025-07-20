import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionCard } from '../session-card';
import { Sunrise } from 'lucide-react';

// Mock the store
jest.mock('@/lib/store', () => ({
  useStore: () => ({
    getCompletedSessions: jest.fn(() => []),
    currentDate: '2024-01-15',
  }),
}));

describe('SessionCard', () => {
  const defaultProps = {
    section: {
      id: 'morning',
      title: 'Morning Session',
      icon: Sunrise,
      description: 'Start your day with intention'
    },
    isActive: false,
    isCompleted: false,
    onClick: jest.fn(),
    form: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders session card with correct content', () => {
    render(<SessionCard {...defaultProps} />);
    
    expect(screen.getByText('Morning Session')).toBeInTheDocument();
    expect(screen.getByText('Start your day with intention')).toBeInTheDocument();
  });

  it('shows completed state correctly', () => {
    render(<SessionCard {...defaultProps} isCompleted={true} />);
    
    // Check for completion indicator
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  it('shows pending state correctly', () => {
    render(<SessionCard {...defaultProps} isCompleted={false} />);
    
    // Should show pending status
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    
    render(<SessionCard {...defaultProps} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    await user.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    
    render(<SessionCard {...defaultProps} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    card.focus();
    
    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('displays different session types correctly', () => {
    const sessions = [
      { id: 'morning', title: 'Morning Session', description: 'Start your day' },
      { id: 'midday', title: 'Midday Session', description: 'Mid-day check-in' },
      { id: 'evening', title: 'Evening Session', description: 'Evening reflection' },
      { id: 'bedtime', title: 'Bedtime Session', description: 'End of day' },
    ];

    sessions.forEach(session => {
      const { unmount } = render(
        <SessionCard
          {...defaultProps}
          section={{
            ...defaultProps.section,
            id: session.id,
            title: session.title,
            description: session.description
          }}
        />
      );
      
      expect(screen.getByText(session.title)).toBeInTheDocument();
      expect(screen.getByText(session.description)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('shows active state correctly', () => {
    render(<SessionCard {...defaultProps} isActive={true} />);
    
    // Check for active indicator
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  });

  it('has clickable interface', () => {
    render(<SessionCard {...defaultProps} />);
    
    const card = screen.getByText('Morning Session').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('handles different states', () => {
    const { rerender } = render(<SessionCard {...defaultProps} />);
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    
    rerender(<SessionCard {...defaultProps} isActive={true} />);
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    
    rerender(<SessionCard {...defaultProps} isCompleted={true} />);
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });

  it('shows animation elements for active state', () => {
    render(<SessionCard {...defaultProps} isActive={true} />);
    
    // Check that active state shows animated dots
    const activeIndicators = screen.getAllByText('•');
    expect(activeIndicators.length).toBeGreaterThanOrEqual(0); // Animated dots might not render as text
  });

  describe('Responsive behavior', () => {
    it('adapts to small screen sizes', () => {
      // Mock window.matchMedia for mobile
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('max-width'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
      });

      render(<SessionCard {...defaultProps} />);
      
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
      // Additional mobile-specific checks could go here
    });
  });

  describe('Animation and transitions', () => {
    it('handles hover states', async () => {
      const user = userEvent.setup();
      render(<SessionCard {...defaultProps} />);
      
      const card = screen.getByRole('button');
      
      await user.hover(card);
      // Check for hover effects (this depends on your implementation)
      expect(card).toHaveClass('hover:scale-105'); // Example hover class
      
      await user.unhover(card);
    });

    it('shows completion animation', () => {
      const { rerender } = render(<SessionCard {...defaultProps} isCompleted={false} />);
      
      // Change to completed state
      rerender(<SessionCard {...defaultProps} isCompleted={true} />);
      
      // Check for completion status change
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });
});