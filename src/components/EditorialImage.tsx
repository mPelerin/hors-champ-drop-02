import { useState } from 'react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export function EditorialImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'HORS CHAMP',
  priority = false,
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col justify-between bg-gradient-to-br from-[#222220] via-[#151515] to-[#2B2B28] p-6 text-[#E8E7E2] select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex items-center justify-between text-xs font-mono text-[#898985]">
          <span>HORS CHAMP</span>
          <span>DROP 01</span>
        </div>
        <div>
          <p className="font-display text-2xl font-bold tracking-tight uppercase text-[#E8E7E2]">
            {fallbackTitle}
          </p>
          <p className="mt-1 text-xs text-[#898985]">Visuel de démonstration</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
