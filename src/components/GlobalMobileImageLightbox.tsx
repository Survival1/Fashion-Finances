import React from 'react';

export interface LightboxImageItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
}

export interface LightboxImagePayload extends LightboxImageItem {
  images?: LightboxImageItem[];
  currentIndex?: number;
}

// Helper export maintained for TypeScript compatibility, disabled as requested
export function openImageLightbox(_payload?: LightboxImagePayload) {
  // Disabled to eliminate this modal/page
}

export const GlobalMobileImageLightbox: React.FC = () => {
  // Disabled completely as requested ("Sobre z.png elimina esta página, haz que no salga")
  return null;
};

export default GlobalMobileImageLightbox;
