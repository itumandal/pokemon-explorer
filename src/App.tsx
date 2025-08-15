import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Loader from './components/Loader';

const PokemonCollection = lazy(() => import('./pages/pokemonCollection/PokemonCollection'));
const PokemonDetail = lazy(() => import('./pages/pokemonDetail/PokemonDetail'));

/**
 * App component is the central routing configuration for the application.
 *
 * Design Decisions:
 * - Using `react-router-dom` `<Routes>` & `<Route>` for modern, declarative routing.
 * - Defined three main routes:
 *    1. `/` → PokemonCollection: Displays the list of Pokémon.
 *    2. `/pokemon/:id/:name` → PokemonDetail: Shows detailed info with dynamic params for direct linking.
 *    3. `*` → NotFound: Handles unknown routes (404 page).
 * - Dynamic routing with `:id` & `:name` improves SEO and allows direct bookmarking of Pokémon pages.
 * - Centralized routing here makes adding/modifying routes easier without touching multiple files.
 *
 * Pros:
 * - Clean, minimal routing setup.
 * - Scales easily as more pages are added.
 * - Strong typing & maintainability with `react-router-dom` v6.
 * - Direct deep linking to Pokémon detail pages.
 * - Graceful handling of invalid URLs.
 *
 * @returns JSX element containing the route definitions.
 */
function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<PokemonCollection />} />
        <Route path="/pokemon/:id/:name" element={<PokemonDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
