interface IHorizontalBaseStatsProps {
  label: string;
  value: number;
  maxValue?: number;
}
/**
 * HorizontalBaseStats Component
 *
 * This component visually represents a single Pokémon stat as a horizontal progress bar.
 * It displays:
 * - A label for the stat (e.g., "HP", "Attack")
 * - A progress bar filled proportionally to the stat value
 * - The numeric value itself
 *
 * Design Decisions:
 * - Used `maxValue` with a default of 100 to normalize different stats for consistent bar lengths.
 * - Used `Math.min` to cap the fill percentage at 100% to avoid overflow.
 * - Tailwind CSS classes for responsive styling.
 * - Gradient color for better Pokémon-themed aesthetics.
 * - `data-testid` for easy test targeting in unit tests.
 *
 * Pros:
 * - Reusable for any type of horizontal stat visualization.
 * - Self-contained; requires only props, no external state.
 * - Easy to style and extend with animations or theming.
 *
 * @param {string} label - The name of the stat (e.g., "Speed").
 * @param {number} value - The actual stat value.
 * @param {number} [maxValue=100] - The maximum possible value to normalize the bar length.
 * @returns {JSX.Element} A styled horizontal bar chart element for a stat.
 */
const HorizontalBaseStats: React.FC<IHorizontalBaseStatsProps> = ({
  label,
  value,
  maxValue = 100,
}) => {
  const pct = Math.min(100, Math.round((value / maxValue) * 100));
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-28 text-sm font-medium">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          data-testid="inner-bar"
          className="h-4 rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#ff7a7a,#ffb6c1)' }}
        />
      </div>
      <div className="w-10 text-right text-sm font-semibold">{value}</div>
    </div>
  );
};

export default HorizontalBaseStats;
