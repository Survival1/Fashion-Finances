/**
 * Utility to compress, resize, and automatically convert images to WebP format
 * to optimize quality/transparency and prevent localStorage QuotaExceededErrors.
 */
export function compressAndResizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name || '');
      const isRasterImage =
        file.type.startsWith('image/') ||
        /\.(png|jpe?g|webp|gif|bmp|avif|tiff?)$/i.test(file.name || '');

      // Keep SVGs or non-image files untouched
      if (!isRasterImage || isSvg) {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const webpDataUrl = canvas.toDataURL('image/webp', quality);
            if (webpDataUrl.startsWith('data:image/webp')) {
              resolve(webpDataUrl);
            } else {
              resolve(canvas.toDataURL('image/jpeg', quality));
            }
          } else {
            resolve(dataUrl);
          }
        } catch (error) {
          console.error('Error during image WebP conversion:', error);
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
