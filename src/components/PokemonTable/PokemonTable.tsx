import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PokemonType {
  icon: React.ReactNode;
  label: string;
}

interface Pokemon {
  id: number;
  image: string;
  name: string;
  baseXp: number;
  types: PokemonType[];
  hp: number;
  speed: number;
  ability: string;
}

interface PokemonTableProps {
  data: Pokemon[];
}

const PokemonTable: React.FC<PokemonTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const handleNavigation = (id: number | undefined, name: string | undefined) => {
    if (id && name) {
      navigate(`/pokemon/${id}/${name}`);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-6 py-3 font-semibold text-sm text-gray-700">Pokémon</th>
            <th className="px-6 py-3 font-semibold text-sm text-gray-700">Type</th>
            <th className="px-6 py-3 font-semibold text-sm text-gray-700">HP</th>
            <th className="px-6 py-3 font-semibold text-sm text-gray-700">Speed</th>
            <th className="px-6 py-3 font-semibold text-sm text-gray-700">Primary Ability</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pokemon, idx) => (
            <tr
              key={pokemon?.id}
              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer`}
              onClick={() => handleNavigation(pokemon?.id, pokemon?.name)}
            >
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex gap-1 min-w-0">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold capitalize">{pokemon.name}</span>
                    <span className="text-sm text-gray-500 leading-tight">
                      Base XP: {pokemon.baseXp}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {pokemon.types.map((type, typeIdx) => (
                    <div key={typeIdx} className="flex items-center gap-1">
                      {type.icon}
                      <span className="text-sm">{type.label}</span>
                      {typeIdx !== pokemon.types.length - 1 && <span>,</span>}
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">{pokemon.hp}</td>
              <td className="px-6 py-4">{pokemon.speed}</td>
              <td className="px-6 py-4">{pokemon.ability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PokemonTable;
