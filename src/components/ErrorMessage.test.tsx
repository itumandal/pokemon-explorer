import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  test('renders default error message when no message prop is provided', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('renders custom error message when message prop is provided', () => {
    const customMessage = 'Failed to load data';
    render(<ErrorMessage message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
