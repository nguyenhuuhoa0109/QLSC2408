import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  layout?: 'stacked' | 'horizontal';
  lightText?: boolean;
}

export const DatPhuongLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true,
  layout = 'stacked',
  lightText = false
}) => {
  const textColor = lightText ? 'text-white' : 'text-[#004e79]';
  const subtitleColor = lightText ? 'text-white/80' : 'text-[#004e79]';

  const fontSizes = {
    xs: { text: 'text-sm font-extrabold', sub: 'text-[7px]', svg: 'w-3 h-3 -mt-1' },
    sm: { text: 'text-base font-black', sub: 'text-[8px]', svg: 'w-3.5 h-3.5 -mt-1' },
    md: { text: 'text-xl sm:text-2xl font-black', sub: 'text-[9px] sm:text-[10px]', svg: 'w-4 h-4 sm:w-5 sm:h-5 -mt-1.5' },
    lg: { text: 'text-2xl sm:text-3xl font-black', sub: 'text-[11px] sm:text-[12px]', svg: 'w-5 h-5 sm:w-6 sm:h-6 -mt-2' },
    xl: { text: 'text-3xl sm:text-4xl font-black', sub: 'text-[13px] sm:text-[14px]', svg: 'w-7 h-7 sm:w-8 sm:h-8 -mt-2.5' },
  }[size];

  return (
    <div className={`flex select-none ${layout === 'horizontal' ? 'flex-row items-center gap-3' : 'flex-col items-center'} ${className}`}>
      {/* Brand Main Text: DATPHUONG with wing logo above the G */}
      <div className="flex items-center">
        <span className={`tracking-tight ${textColor} ${fontSizes.text} font-sans uppercase`}>
          DATPHUON
        </span>
        
        {/* The 'G' letter with stylized double curve/wings above it */}
        <div className="relative inline-flex items-center">
          <span className={`tracking-tight ${textColor} ${fontSizes.text} font-sans uppercase`}>
            G
          </span>
          {/* Stylized Red and Blue Wings matching the official logo.png */}
          <div className={`absolute -top-2.5 -right-3 sm:-right-4 ${fontSizes.svg} pointer-events-none`}>
            <svg
              viewBox="0 0 40 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-2xs"
            >
              {/* Upper Red Wing Curve */}
              <path
                d="M4 22C10 9 24 4 36 6C28 11 18 16 4 22Z"
                fill="#D9251D"
              />
              {/* Lower Dark Blue Wing Curve */}
              <path
                d="M11 25C17 17 28 15 37 17C30 22 21 24 11 25Z"
                fill="#004E79"
              />
            </svg>
          </div>
          {/* Registered symbol */}
          <span className={`text-[8px] font-bold ${textColor} ml-2.5 sm:ml-3 self-start -mt-0.5`}>
            ®
          </span>
        </div>
      </div>

      {/* Subtitle: SON TRA ENERGY */}
      {showSubtitle && (
        <span 
          className={`uppercase font-bold tracking-[0.25em] ${subtitleColor} ${fontSizes.sub} mt-0.5 whitespace-nowrap`}
        >
          SON TRA ENERGY
        </span>
      )}
    </div>
  );
};
