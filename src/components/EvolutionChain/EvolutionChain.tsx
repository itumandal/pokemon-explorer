import React from 'react';
import { IEvolutionChainResponse, IEvolutionNode } from '../../customHooks/usePokemonQueries';

/**
 * Recursively renders a single node of the evolution chain along with its children.
 *
 * @param {IEvolutionNode} node - The evolution node containing species info and possible next evolutions.
 * @returns {React.ReactNode} JSX structure representing the current evolution stage and its subsequent evolutions.
 */
const renderNode = (node: IEvolutionNode): React.ReactNode => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-gray-50 rounded-lg p-3 w-28 text-center">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractIdFromSpeciesUrl(node.species.url)}.png`}
          alt={node.species.name}
          className="mx-auto w-16 h-16"
        />
        <div className="mt-2 capitalize text-sm">{node.species.name}</div>
      </div>
      {/* Render children evolution stages if available */}
      {node.evolves_to.length > 0 && (
        <div className="flex items-center gap-4">
          {node.evolves_to.map((child) => (
            <React.Fragment key={child.species.name}>
              <div className="text-2xl">→</div>
              <div>{renderNode(child)}</div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

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
const extractIdFromSpeciesUrl = (url: string): string => {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
};

/**
 * Renders the entire evolution chain for a Pokémon.
 *
 * @component
 * @param {IEvolutionChainResponse} props - The evolution chain response containing the root `chain` node.
 * @returns {JSX.Element | null} - JSX structure of the evolution chain, or null if no chain data exists.
 */
const EvolutionChain: React.FC<IEvolutionChainResponse> = ({ chain }) => {
  if (!chain) return null;
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Evolution Chain</h3>
      <div>{renderNode(chain)}</div>
    </div>
  );
};

export default EvolutionChain;
