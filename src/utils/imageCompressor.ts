/**
 * Utility to compress and resize images to prevent localStorage QuotaExceededErrors.
 * Resizes the image so that neither width nor height exceeds the specified maximum.
 * Compresses the image using JPEG format and the specified quality (0.0 to 1.0).
 */
export function compressAndResizeImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // If it's not an image (e.g. svg or other types that might not draw on canvas nicely),
      // or if canvas drawing is not supported/needed, return the original dataurl.
      if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
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
            const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(resizedDataUrl);
          } else {
            resolve(dataUrl);
          }
        } catch (error) {
          console.error('Error during image canvas compression:', error);
          resolve(dataUrl); // Fallback to uncompressed
        }
      };
      img.onerror = () => {
        resolve(dataUrl); // Fallback to uncompressed
      };
      img.src = dataUrl;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
