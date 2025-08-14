// src/pages/notFound/NotFound.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 via-red-400 to-blue-500 text-white px-4">
      <h1 className="text-7xl font-bold drop-shadow-lg">404</h1>
      <p className="mt-4 text-2xl font-semibold drop-shadow-md">
        Uh-oh! This page is missing like a wild Pokémon
      </p>
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
        alt="Pikachu"
        className="mt-6 w-24 h-24 animate-bounce"
      />
      <a
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full shadow-md transition duration-200"
      >
        Back to Pokédex
      </a>
    </div>
  );
}
