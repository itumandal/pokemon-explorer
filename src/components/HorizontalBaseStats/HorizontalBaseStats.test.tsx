import { render, screen } from '@testing-library/react';
import HorizontalBaseStats from './HorizontalBaseStats';

describe('HorizontalBaseStats', () => {
  test('renders label and value correctly', () => {
    render(<HorizontalBaseStats label="HP" value={50} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('calculates percentage width correctly', () => {
    render(<HorizontalBaseStats label="Attack" value={75} maxValue={150} />);
    const innerBar = screen.getByTestId('inner-bar');
    expect(innerBar).toHaveStyle({ width: '50%' });
  });
  test('caps percentage at 100%', () => {
    render(<HorizontalBaseStats label="Defense" value={120} maxValue={100} />);
    const innerBar = screen.getByTestId('inner-bar');
    expect(innerBar).toHaveStyle({ width: '100%' });
  });

  test('uses default maxValue of 100 when not provided', () => {
    render(<HorizontalBaseStats label="Speed" value={40} />);
    const innerBar = screen.getByTestId('inner-bar');
    expect(innerBar).toHaveStyle({ width: '40%' });
  });
});
