import { render, screen } from '@testing-library/react';
import EvolutionChain from './EvolutionChain';
import type { IEvolutionChainResponse, IEvolutionNode } from '../../customHooks/usePokemonQueries';

describe('EvolutionChain', () => {
  const mockNode: IEvolutionNode = {
    species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
    evolves_to: [],
  };

  const mockChain: IEvolutionChainResponse = {
    chain: mockNode,
  };

  const mockMultiNode: IEvolutionNode = {
    species: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' },
    evolves_to: [
      {
        species: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon-species/5/' },
        evolves_to: [
          {
            species: { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon-species/6/' },
            evolves_to: [],
          },
        ],
      },
    ],
  };

  test('renders single node correctly', () => {
    render(<EvolutionChain chain={mockChain.chain} />);
    expect(screen.getByText('Evolution Chain')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    const img = screen.getByAltText('bulbasaur') as HTMLImageElement;
    expect(img.src).toContain('/1.png');
  });

  test('renders multi-level evolution chain with arrows', () => {
    render(<EvolutionChain chain={mockMultiNode} />);
    expect(screen.getByText('charmander')).toBeInTheDocument();
    const charmanderImg = screen.getByAltText('charmander') as HTMLImageElement;
    expect(charmanderImg.src).toContain('/4.png');

    expect(screen.getByText('charmeleon')).toBeInTheDocument();
    const charmeleonImg = screen.getByAltText('charmeleon') as HTMLImageElement;
    expect(charmeleonImg.src).toContain('/5.png');

    expect(screen.getByText('charizard')).toBeInTheDocument();
    const charizardImg = screen.getByAltText('charizard') as HTMLImageElement;
    expect(charizardImg.src).toContain('/6.png');

    const arrows = screen.getAllByText('→');
    expect(arrows.length).toBe(2);
  });

  test('renders null if chain is missing', () => {
    const { container } = render(<EvolutionChain chain={null} />);
    expect(container.firstChild).toBeNull();
  });
});
