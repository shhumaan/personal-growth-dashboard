import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MorningForm } from '../morning-form';

// Mock the validations
jest.mock('@/lib/validations', () => ({
  morningSessionSchema: {
    parse: jest.fn((data) => data),
  },
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useStore: () => ({
    addMorningEntry: jest.fn(),
    currentDate: new Date().toISOString().split('T')[0],
  }),
}));

describe('MorningForm', () => {
  const mockOnComplete = jest.fn();
  const mockOnCancel = jest.fn();
  const defaultData = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    expect(screen.getByText(/wake.*time/i)).toBeInTheDocument();
    expect(screen.getByText(/focus.*level/i)).toBeInTheDocument();
    expect(screen.getByText(/energy.*level/i)).toBeInTheDocument();
    expect(screen.getByText(/gratitude/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /complete.*journey/i })).toBeInTheDocument();
  });

  it('displays form sections', () => {
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    // Check main sections are rendered
    expect(screen.getByText(/morning power-up/i)).toBeInTheDocument();
    expect(screen.getByText(/start your day with intention/i)).toBeInTheDocument();
  });

  it('has proper form structure', () => {
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    // Check form exists
    const form = document.querySelector('#morning-form');
    expect(form).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    // Fill out gratitude field
    const gratitudeTextarea = screen.getByPlaceholderText(/grateful for/i);
    await user.type(gratitudeTextarea, 'Grateful for testing');
    
    const saveButton = screen.getByRole('button', { name: /complete.*journey/i });
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('handles cancel action', async () => {
    const user = userEvent.setup();
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('has slider components', async () => {
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    // Check that sliders are rendered
    expect(screen.getByText(/focus.*level/i)).toBeInTheDocument();
    expect(screen.getByText(/energy.*level/i)).toBeInTheDocument();
  });

  it('has text areas for input', () => {
    render(<MorningForm data={defaultData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    // Check for text areas
    expect(screen.getByPlaceholderText(/grateful for/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/thoughts or plans/i)).toBeInTheDocument();
  });

  it('renders with pre-filled data', () => {
    const prefilledData = {
      gratitude_entry: 'Pre-filled gratitude',
      notes_morning: 'Pre-filled notes'
    };
    
    render(<MorningForm data={prefilledData} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    
    expect(screen.getByDisplayValue('Pre-filled gratitude')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pre-filled notes')).toBeInTheDocument();
  });
});