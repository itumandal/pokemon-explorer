import React from 'react';

interface IDistributionItem {
  icon: React.ReactNode; // can be an <img>, emoji, SVG, etc.
  percentage: string | number;
}

export type PokemonLayout = 'default' | 'distribution';

export interface IPokemonDashboardStatsProps {
  topText?: string;
  value?: string | number;
  bottomText?: string;
  layout?: PokemonLayout;
  distributionItems?: IDistributionItem[];
}

const PokemonDashboardStats: React.FC<IPokemonDashboardStatsProps> = ({
  topText,
  value,
  bottomText,
  layout = 'default',
  distributionItems = [],
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      {layout === 'default' && (
        <>
          {topText && <p className="text-sm text-gray-500">{topText}</p>}
          {value !== undefined && <p className="text-3xl font-bold text-black">{value}</p>}
          {bottomText && <p className="text-sm text-gray-500">{bottomText}</p>}
        </>
      )}

      {layout === 'distribution' && (
        <>
          {topText && <p className="text-sm text-gray-500 mb-3">{topText}</p>}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {distributionItems.map((item: IDistributionItem, id: number) => (
              <div key={id} className="flex items-center gap-1">
                {item.icon}
                <span className="text-base font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PokemonDashboardStats;
