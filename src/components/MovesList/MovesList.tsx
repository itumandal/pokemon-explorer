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
/**
 * MovesList Component
 *
 * @description
 * Renders a scrollable list of Pokémon moves with lazy-loading (infinite scroll) functionality.
 * The component progressively loads move details in chunks to optimize performance and network usage.
 *
 * @component
 * @param {IMovesListProps} props - The props object
 * @param {IMoveItem[] | undefined} props.moves - Array of moves to display (only basic info initially)
 *
 * @design-decisions
 * - **Chunked Loading (`CHUNK_SIZE`)**: Avoids loading all moves at once for performance and smoother UX.
 * - **IntersectionObserver**: Detects when the "load more" element is visible to trigger fetching next chunk.
 * - **React Query (`usePokemonMoveQuery`)**: Handles caching, deduplication, and background fetching of move details.
 * - **Separate Loader/Error States**: Improves clarity and allows granular UI feedback for loading and error handling.
 *
 * @pros
 * - Reduces initial render time for Pokémon with many moves.
 * - Leverages browser-native IntersectionObserver API for efficient scroll detection.
 * - Integrates well with React Query caching, so previously loaded chunks are not refetched.
 * - Improves accessibility and user experience by providing a smooth infinite scroll.
 *
 * @returns {JSX.Element} Scrollable move list with type icons and lazy-loaded details.
 */
const MovesList: React.FC<IMovesListProps> = ({ moves }) => {
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  /** Slice the list to only the currently visible chunk */
  const currentVisible = moves?.slice(0, visibleCount) ?? [];
  const { moveQueries, fetchedMoves } = usePokemonMoveQuery(currentVisible);

  const isInitialLoading = moveQueries.some((q) => q.isLoading) && fetchedMoves.length === 0;
  const isError = moveQueries.some((q) => q.isError);

  /**
   * Infinite scroll logic:
   * - Uses IntersectionObserver to watch the sentinel div (`loadMoreRef`)
   * - When it comes into view, increases `visibleCount` by CHUNK_SIZE
   * - Also checks immediately after mount to handle "already in view" cases
   */
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => (prev >= (moves ?? []).length ? prev : prev + CHUNK_SIZE));
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);

    // Immediate check after render to handle "already visible" case
    requestAnimationFrame(() => {
      if (
        loadMoreRef.current &&
        loadMoreRef.current.getBoundingClientRect().top < window.innerHeight
      ) {
        setVisibleCount((prev) => (prev >= (moves ?? []).length ? prev : prev + CHUNK_SIZE));
      }
    });

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [moves?.length, fetchedMoves.length]);

  if (isInitialLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="max-h-96 overflow-auto">
      <ul className="space-y-2" role="list">
        {fetchedMoves.map((m) => (
          <li
            key={m.move.name}
            className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3"
            role="listitem"
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
