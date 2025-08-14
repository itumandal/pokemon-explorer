import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound', () => {
  test('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('renders the descriptive message', () => {
    render(<NotFound />);
    expect(
      screen.getByText('Uh-oh! This page is missing like a wild Pokémon')
    ).toBeInTheDocument();
  });

  test('renders the Pikachu image with correct alt and src', () => {
    render(<NotFound />);
    const img = screen.getByAltText('Pikachu') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    );
  });

  test('renders the back link with correct href', () => {
    render(<NotFound />);
    const link = screen.getByText('Back to Pokédex') as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.href).toContain('/'); // partial match, works in JSDOM
  });
});
