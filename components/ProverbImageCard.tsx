import React from "react";

interface ProverbImageProps {
  proverb: {
    id: number;
    proverb: string;
    translation: string;
    wisdom: string;
  };
}

/**
 * A fixed-size card component designed specifically for image export
 * This ensures consistent dimensions and styling when sharing proverbs as images
 */
const ProverbImageCard: React.FC<ProverbImageProps> = ({ proverb }) => {
  return (
    <div
      className="bg-white p-6 shadow-lg"
      style={{
        width: "350px",
        
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Decorative top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 to-orange-500"
        style={{ marginTop: "0" }}
      />

      <div className="flex flex-col justify-between h-full pt-4">
        {/* Content area */}
        <div>
          <div className="mb-6">
            {/* App branding */}
            <p className="text-sm font-medium text-amber-600 mb-4">
              Yoruba Proverbs
            </p>

            {/* Proverb */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900 leading-snug">
              {proverb.proverb}
            </h2>

            {/* Translation */}
            <div className="mb-4">
              <span className="text-sm font-medium text-amber-700 block mb-1">
                Translation:
              </span>
              <p className="text-base text-gray-700 border-l-4 border-amber-300 pl-4">
                {proverb.translation}
              </p>
            </div>

            {/* Wisdom */}
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-1">
                Wisdom:
              </span>
              <p className="text-sm text-gray-600 border-l-4 border-gray-200 pl-4">
                {proverb.wisdom}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Proverb #{proverb.id}</div>
          <div className="text-xs text-gray-400">yorubaproverbs.vercel.app</div>
        </div>
      </div>
    </div>
  );
};

export default ProverbImageCard;
