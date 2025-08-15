import React from 'react';
import { IEvolutionChainResponse, IEvolutionNode } from '../../customHooks/usePokemonQueries';

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

// helper to get id from the species url like .../pokemon-species/{id}/
const extractIdFromSpeciesUrl = (url: string): string => {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
};

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
