import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PokemonType {
  icon: React.ReactNode;
  label: string;
}

interface IPokemon {
  id: number;
  image: string;
  name: string;
  baseXp: number;
  types: PokemonType[];
  hp: number;
  speed: number;
  ability: string;
}

export interface IPokemonTableProps {
  data: IPokemon[];
}
/**
 * Renders a table of Pokémon with their details such as type, HP, speed, and ability.
 * Clicking on a row navigates to that Pokémon's detail page.
 *
 * @param {IPokemonTableProps} props - The list of Pokémon data to display.
 * @returns A styled table displaying Pokémon details.
 */
const PokemonTable: React.FC<IPokemonTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IPokemon;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  /**
   * Navigates to the detail page of a specific Pokémon.
   *
   * @param {number | undefined} id - The ID of the Pokémon.
   * @param {string | undefined} name - The name of the Pokémon.
   * @returns {void}
   */
  const handleNavigation = (id: number | undefined, name: string | undefined) => {
    if (id && name) {
      navigate(`/pokemon/${id}/${name}`);
    }
  };

  /**
   * Handles sorting logic when a column header is clicked.
   * If clicked again, it toggles between ascending and descending.
   */
  const handleSort = (key: keyof IPokemon) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Searching pokemon
  const filteredPokemonData = useMemo(() => {
    if (!searchValue) return data;
    return data.filter((pokemon) => {
      const term = searchValue.toLowerCase();
      return (
        pokemon.name.toLowerCase().includes(term) ||
        pokemon.ability.toLowerCase().includes(term) ||
        pokemon.types.some((t) => t.label.toLowerCase().includes(term)) ||
        pokemon.baseXp.toString().includes(term) ||
        pokemon.hp.toString().includes(term) ||
        pokemon.speed.toString().includes(term)
      );
    });
  }, [data, searchValue]);

  /**
   * Sorts the Pokémon data based on the current sortConfig.
   */
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredPokemonData;

    return [...filteredPokemonData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredPokemonData, sortConfig]);

  /**
   * Renders the sorting arrow ↑↓ for headers.
   */
  const renderSortArrow = (key: keyof IPokemon) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
      <table className="min-w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th
              className="px-6 py-3 font-semibold text-sm text-gray-700 cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Pokémon {renderSortArrow('name')}
            </th>
            <th className="px-6 py-3 font-semibold text-sm text-gray-700">Type</th>
            <th
              className="px-6 py-3 font-semibold text-sm text-gray-700 cursor-pointer"
              onClick={() => handleSort('hp')}
            >
              HP {renderSortArrow('hp')}
            </th>
            <th
              className="px-6 py-3 font-semibold text-sm text-gray-700 cursor-pointer"
              onClick={() => handleSort('speed')}
            >
              Speed {renderSortArrow('speed')}
            </th>
            <th
              className="px-6 py-3 font-semibold text-sm text-gray-700 cursor-pointer"
              onClick={() => handleSort('ability')}
            >
              Primary Ability {renderSortArrow('ability')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((pokemon, idx) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No Pokémon found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PokemonTable;
