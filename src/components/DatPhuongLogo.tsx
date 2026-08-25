import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const DatPhuongLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-1.5 font-bold tracking-tight text-[#004f8c]">
        <div className="flex items-center">
          <span className={`font-extrabold tracking-tighter ${isLg ? 'text-2xl sm:text-3xl' : isSm ? 'text-base' : 'text-xl'}`}>
            DATPHUONG
          </span>
          <svg
            className={`ml-0.5 inline-block ${isLg ? 'w-5 h-5 -mt-2' : isSm ? 'w-3 h-3 -mt-1' : 'w-4 h-4 -mt-1.5'}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 17C7.5 7.5 16 5 21 7C17 11 11 14 3 17Z"
              fill="#E52320"
            />
            <path
              d="M8 19C12 14 18 12.5 22 13.5C18.5 16.5 14 18 8 19Z"
              fill="#005394"
            />
          </svg>
        </div>
      </div>
      {showSubtitle && (
        <span className={`uppercase font-semibold tracking-widest text-[#005394] ${isLg ? 'text-[11px] mt-0.5' : isSm ? 'text-[8px]' : 'text-[9px]'}`}>
          SON TRA ENERGY
        </span>
      )}
    </div>
  );
};
