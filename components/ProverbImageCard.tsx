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
      className="bg-white p-6 shadow-xl font-sans"
      style={{
        width: "350px",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500" />

      <div className="flex flex-col justify-between h-full pt-4 space-y-6">
        {/* Branding */}
        <div className="text-sm font-semibold text-amber-600 tracking-wide">
          Yoruba Proverbs
        </div>

        {/* Main Proverb */}
        <h2 className="text-lg font-serif font-semibold text-gray-900 leading-snug">
          {proverb.proverb}
        </h2>

        {/* Translation */}
        <div>
          <p className="text-xs font-medium text-amber-700 uppercase mb-1 tracking-wide">
            Translation
          </p>
          <p className="text-base text-gray-800 border-l-2 border-amber-400 pl-1 leading-relaxed">
            {proverb.translation}
          </p>
        </div>

        {/* Wisdom */}
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase mb-1 tracking-wide">
            Wisdom
          </p>
          <p className="text-sm text-gray-600 border-l-2 border-gray-200 pl-1 italic">
            {proverb.wisdom}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>Proverb #{proverb.id}</span>
          <span>yorubaproverbs.vercel.app</span>
        </div>
      </div>
    </div>
  );
};


export default ProverbImageCard;
