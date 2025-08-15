interface IHorizontalBaseStatsProps {
  label: string;
  value: number;
  maxValue?: number;
}

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
