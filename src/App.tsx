import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PokemonCollection from './pages/pokemonCollection/PokemonCollection';
import PokemonDetail from './pages/pokemonDetail/PokemonDetail copy';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PokemonCollection />} />
          <Route path="/pokemon/:id/:name" element={<PokemonDetail />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
