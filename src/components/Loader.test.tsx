import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  test('renders the loading text', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('applies the correct CSS classes', () => {
    render(<Loader />);
    const loaderDiv = screen.getByText('Loading...');
    expect(loaderDiv).toHaveClass('text-center');
    expect(loaderDiv).toHaveClass('p-4');
    expect(loaderDiv).toHaveClass('bg-gray-100');
    expect(loaderDiv).toHaveClass('rounded');
    expect(loaderDiv).toHaveClass('animate-pulse');
  });
});
