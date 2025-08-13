import { useMemo, useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import Loader from '../../components/Loader';
import PokemonDashboardStats, {
  type PokemonLayout,
} from '../../components/PokemonDashboardStatsCard';
import PokemonTable from '../../components/PokemonTable/PokemonTable';
import { usePokemonList } from '../../customHooks/usePokemonQueries';
import type { IPokemonDetail } from '../../types/pokemon';
import { getTypeStyle } from '../../utils/pokemonColors';

const PokemonCollection = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const offset = (page - 1) * limit;

  const {
    pokemonListQuery: { data, isLoading, isError },
    detailQueries,
  } = usePokemonList(limit, offset, page);

  const allSuccess = detailQueries.every((q) => q.isSuccess);
  const isDetailsLoading = detailQueries.some((q) => q.isLoading);

  const pokemonDetails: IPokemonDetail[] = allSuccess
    ? detailQueries.map((q) => q.data as IPokemonDetail)
    : [];

  const averageHP = useMemo(() => {
    if (pokemonDetails.length === 0) return 0;
    const totalHpInCurrentPage = pokemonDetails.reduce((acc, curr) => {
      const currentHP = curr.stats.find((stat) => stat.stat.name === 'hp')?.base_stat ?? 0;
      return acc + currentHP;
    }, 0);

    return totalHpInCurrentPage / pokemonDetails.length;
  }, [pokemonDetails]);

  const mostPowerfulPokemon = useMemo(() => {
    if (pokemonDetails.length === 0) return null;
    return pokemonDetails
      .map((p) => {
        const totalStats = p.stats.reduce((sum, s) => sum + s.base_stat, 0);
        return { name: p.name, score: totalStats };
      })
      .sort((a, b) => b.score - a.score)[0];
  }, [pokemonDetails]);

  const typeDistribution = useMemo(() => {
    if (pokemonDetails.length === 0) return [];
    const typeCounts: Record<string, number> = {};
    pokemonDetails.forEach((p) => {
      p.types.forEach((t) => {
        const typeName = t.type.name;
        typeCounts[typeName] = (typeCounts[typeName] ?? 0) + 1;
      });
    });

    const distributionPokemonType = Object.entries(typeCounts)
      .map(([type, count]) => ({
        icon: (
          <span
            key={type}
            className="px-2 py-1 text-white rounded-full"
            style={{ backgroundColor: getTypeStyle(type).color }}
          >
            {`${getTypeStyle(type).icon}${type}`}
          </span>
        ),
        percentage: Math.round((count / pokemonDetails.length) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);
    // .slice(0, 3);
    return distributionPokemonType;
  }, [pokemonDetails]);

  const cardDetails = [
    {
      topText: 'Total Pokemon',
      value: data?.count,
      bottomText: 'in collection',
    },
    {
      topText: 'Average HP',
      value: averageHP.toFixed(1),
      bottomText: 'points',
    },
    {
      topText: 'Type Distribution',
      distributionItems: typeDistribution,
      layout: 'distribution' as PokemonLayout,
    },
    {
      topText: 'Most Powerful',
      value:
        (mostPowerfulPokemon?.name || '').charAt(0).toUpperCase() +
        mostPowerfulPokemon?.name.slice(1),
      bottomText: `Score: ${mostPowerfulPokemon?.score}`,
    },
  ];

  const tableData = pokemonDetails.map((pokemon) => {
    return {
      id: pokemon?.id,
      image: pokemon?.sprites?.front_default,
      name: pokemon?.name,
      baseXp: pokemon?.base_experience,
      types: pokemon?.types?.map((poketype) => ({
        label: poketype?.type?.name,
        icon: (
          <span
            key={poketype?.type?.name}
            className="px-2 py-1 text-white rounded-full"
            style={{ backgroundColor: getTypeStyle(poketype.type.name).color }}
          >
            {getTypeStyle(poketype.type.name).icon}
          </span>
        ),
      })),
      hp: pokemon?.stats?.find((poke) => poke.stat.name === 'hp')?.base_stat ?? 0,
      speed: pokemon?.stats?.find((poke) => poke.stat.name === 'speed')?.base_stat ?? 0,
      ability: pokemon?.abilities[0].ability?.name ?? 'Unknown',
    };
  });

  if (isLoading || isDetailsLoading) return <Loader />;
  if (isError) return <ErrorMessage />;
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Pokémon Collection</h1>
      <div className="grid grid-cols-4 gap-4">
        {cardDetails.map((card, idx) => (
          <PokemonDashboardStats key={idx} {...card} />
        ))}
      </div>
      <div className="mt-4">
        <PokemonTable data={tableData} />
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          disabled={page === 1}
          onClick={() => setPage((prevPage) => prevPage - 1)}
        >
          Prev
        </button>
        <span className="px-3 py-1">
          {page} / {Math.ceil((data?.count ?? 0) / limit)}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          disabled={page === Math.ceil((data?.count ?? 0) / limit)}
          onClick={() => {
            setPage((prevPage) => prevPage + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonCollection;
