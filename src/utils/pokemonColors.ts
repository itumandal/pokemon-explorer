export const typeColors: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const getTypeColor = (typeName: string): string => {
  return typeColors[typeName.toLowerCase()] ?? '#A8A77A';
};

export const typeStyles: Record<string, { color: string; icon: string }> = {
  normal: { color: '#A8A77A', icon: '🔘' },
  fire: { color: '#EE8130', icon: '🔥' },
  water: { color: '#6390F0', icon: '💧' },
  electric: { color: '#F7D02C', icon: '⚡' },
  grass: { color: '#7AC74C', icon: '🌿' },
  ice: { color: '#96D9D6', icon: '❄️' },
  fighting: { color: '#C22E28', icon: '🥊' },
  poison: { color: '#A33EA1', icon: '☠️' },
  ground: { color: '#E2BF65', icon: '🌎' },
  flying: { color: '#A98FF3', icon: '🕊️' },
  psychic: { color: '#F95587', icon: '🔮' },
  bug: { color: '#A6B91A', icon: '🐛' },
  rock: { color: '#B6A136', icon: '🪨' },
  ghost: { color: '#735797', icon: '👻' },
  dragon: { color: '#6F35FC', icon: '🐉' },
  dark: { color: '#705746', icon: '🌑' },
  steel: { color: '#B7B7CE', icon: '⚙️' },
  fairy: { color: '#D685AD', icon: '🧚‍♀️' },
};

export const getTypeStyle = (typeName: string) => {
  return typeStyles[typeName.toLowerCase()] ?? { color: '#A8A77A', icon: '❓' };
};
