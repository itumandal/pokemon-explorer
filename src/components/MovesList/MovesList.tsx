import React, { useState, useEffect, useRef } from 'react';
import { usePokemonMoveQuery } from '../../customHooks/usePokemonQueries';
import { getTypeStyle } from '../../utils/pokemonColors';
import ErrorMessage from '../ErrorMessage';
import Loader from '../Loader';

export interface IMoveItem {
  move: { name: string; url: string };
  type: { name: string };
}

interface IMovesListProps {
  moves: IMoveItem[] | undefined;
}

const CHUNK_SIZE = 20;

const MovesList: React.FC<IMovesListProps> = ({ moves }) => {
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentVisible = moves?.slice(0, visibleCount) ?? [];
  const { moveQueries, fetchedMoves } = usePokemonMoveQuery(currentVisible);

  const isInitialLoading = moveQueries.some((q) => q.isLoading) && fetchedMoves.length === 0;
  const isError = moveQueries.some((q) => q.isError);

  // Infinite scroll: load more moves when user reaches bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => (prev >= (moves ?? []).length ? prev : prev + CHUNK_SIZE));
        }
      },
      { rootMargin: '100px' }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [moves?.length]);

  if (isInitialLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="max-h-96 overflow-auto">
      <ul className="space-y-2">
        {fetchedMoves.map((m) => (
          <li
            key={m.move.name}
            className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3"
          >
            <span className="capitalize">{m.move.name.replace('-', ' ')}</span>
            <span className="text-xs bg-white border px-2 py-1 rounded-full text-gray-600">
              {`${getTypeStyle(m.type.name).icon}${m.type.name}`}
            </span>
          </li>
        ))}
      </ul>

      {/* Loader for next chunks */}
      {visibleCount < (moves ?? []).length && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {moveQueries.some((q) => q.isLoading) && <Loader />}
        </div>
      )}
    </div>
  );
};

export default MovesList;
