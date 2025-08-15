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
