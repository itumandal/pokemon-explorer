import React, { useCallback } from 'react';
import { IEvolutionChainResponse, IEvolutionNode } from '../../customHooks/usePokemonQueries';
import { useNavigate } from 'react-router-dom';

/**
 * Recursively renders a single node of the evolution chain along with its children.
 *
 * @param {IEvolutionNode} node - The evolution node containing species info and possible next evolutions.
 * @returns {React.ReactNode} JSX structure representing the current evolution stage and its subsequent evolutions.
 */

interface IEvolutionNodeProps {
  node: IEvolutionNode;
  onSelect: (id: string, name: string) => void;
}
const EvolutionNode: React.FC<IEvolutionNodeProps> = React.memo(({ node, onSelect }) => {
  return (
    <div className="flex items-center gap-4 cursor-pointer">
      <div
        className="bg-gray-50 rounded-lg p-3 w-28 text-center hover:bg-gray-100"
        onClick={() => onSelect(extractIdFromSpeciesUrl(node.species.url) ?? '', node.species.name)}
      >
        <img
          src={
            extractIdFromSpeciesUrl(node.species.url)
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractIdFromSpeciesUrl(
                  node.species.url
                )}.png`
              : `https://img.pokemondb.net/sprites/home/normal/${node.species.name}.png`
          }
          alt={node.species.name}
          className="mx-auto w-16 h-16"
        />
        <div className="mt-2 capitalize text-sm">{node.species.name}</div>
      </div>

      {/* Render children if available */}
      {node.evolves_to.length > 0 && (
        <div className="flex items-center gap-4">
          {node.evolves_to.map((child) => (
            <React.Fragment key={child.species.name}>
              <div className="text-2xl">→</div>
              <EvolutionNode node={child} onSelect={onSelect} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
});

/**
 * Extracts the Pokémon species ID from its API URL.
 *
 * @param {string} url - Full Pokémon species URL from the API.
 * @returns {string} - Extracted species ID as a string.
 *
 * @example
 * // returns "25"
 * extractIdFromSpeciesUrl("https://pokeapi.co/api/v2/pokemon-species/25/")
 */
const extractIdFromSpeciesUrl = (url: string): string | null => {
  const parts = url.split('/').filter(Boolean);
  const id = parts[parts.length - 1] ?? '';
  return isNaN(Number(id)) ? null : id;
};

/**
 * Renders the entire evolution chain for a Pokémon.
 *
 * @component
 * @param {IEvolutionChainResponse} props - The evolution chain response containing the root `chain` node.
 * @returns {JSX.Element | null} - JSX structure of the evolution chain, or null if no chain data exists.
 */

const EvolutionChain: React.FC<IEvolutionChainResponse> = ({ chain }) => {
  const navigate = useNavigate();
  if (!chain) return null;

  const handleSelect = useCallback(
    (id: string, name: string) => {
      navigate(`/pokemon/${id}/${name}`);
    },
    [navigate]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Evolution Chain</h3>
      <EvolutionNode node={chain} onSelect={handleSelect} />
    </div>
  );
};

export default EvolutionChain;
