import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usePokemonDetailQuery } from '../../customHooks/usePokemonQueries';
import { usePokemonStats } from '../../customHooks/usePokemonStats';
import { getTypeStyle } from '../../utils/pokemonColors';
import HorizontalBaseStats from '../../components/HorizontalBaseStats';
import MovesList from '../../components/MovesList';
import { getPokemonDetail } from '../../api/pokemonApi';
import { createStatsMap, getStatValue, STAT_CONFIG } from '../../utils/config';

const PokemonDetail = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const { data: detailPokemonQuery } = useQuery({
    queryKey: ['pokemonDetail', name],
    queryFn: () => getPokemonDetail(name ?? ''),
    staleTime: 1000 * 60 * 5,
  });
  const { speciesQuery, evolutionQuery } = usePokemonDetailQuery(id, detailPokemonQuery);
  const pokemon = detailPokemonQuery;
  const statsMap = createStatsMap(pokemon);
  const isLoading = speciesQuery.isLoading || evolutionQuery.isLoading;
  const isError = speciesQuery.isError;

  const { typeList } = usePokemonStats(detailPokemonQuery);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  if (isError || !pokemon) {
    return <div className="p-6 text-red-600">Unable to load Pokémon details.</div>;
  }

  return (
    <div className="rounded-lg m-4 shadow">
      <button
        className="mb-4 flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <div className="bg-gradient-to-r from-red-400 via-purple-500 to-blue-600 rounded-t-lg text-white pl-6 pr-6 h-50 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
          <div className="text-sm mt-1">#{pokemon.id.toString().padStart(3, '0')}</div>
        </div>
        <img
          src={
            pokemon.sprites.other?.['official-artwork']?.front_default ??
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="w-30 h-30 rounded-full p-2 bg-white/20"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="col-span-1 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Type</h3>
            <div className="flex gap-2 mt-2">
              {typeList.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: getTypeStyle(t).color }}
                >
                  {`${getTypeStyle(t).icon}${t}`}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Abilities</h3>
            <div className="flex gap-2 mt-2">
              {pokemon.abilities.map((a) => (
                <span
                  key={a.ability.name}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm capitalize"
                >
                  {a.ability.name}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-semibold">Physical Traits</h3>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div>
              <div className="text-xl font-bold">{(pokemon.height / 10).toFixed(2)}m</div>
              <div className="text-sm text-gray-500">Height</div>
            </div>
            <div>
              <div className="text-xl font-bold">{(pokemon.weight / 10).toFixed(1)}kg</div>
              <div className="text-sm text-gray-500">Weight</div>
            </div>
            <div>
              <div className="text-xl font-bold">{pokemon.base_experience}</div>
              <div className="text-sm text-gray-500">Base Exp</div>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-white p-4">
          <h3 className="text-lg font-semibold mb-4">Base Stats</h3>

          <div className="space-y-2">
            {STAT_CONFIG.map((stat) => (
              <HorizontalBaseStats
                key={stat.label}
                label={stat.label}
                value={getStatValue(statsMap, stat.keys)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Evolution chain */}
      {/* {evolutionQuery.data?.chain && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <EvolutionChain chain={evolutionQuery.data.chain} />
        </div>
      )} */}
      {/* Moves */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Moves</h3>
        <MovesList moves={pokemon?.moves} />
      </div>
    </div>
  );
};

export default PokemonDetail;
