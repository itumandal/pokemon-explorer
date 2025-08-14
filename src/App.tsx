import { Route, Routes } from 'react-router-dom';
import PokemonCollection from './pages/pokemonCollection/PokemonCollection';
import PokemonDetail from './pages/pokemonDetail/PokemonDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokemonCollection />} />
      <Route path="/pokemon/:id/:name" element={<PokemonDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
