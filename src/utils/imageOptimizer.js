/**
 * Utility to process, resize, and compress images uploaded directly from phones or computers.
 * Scales large camera photos down to web-optimized dimensions (max 1200px),
 * preventing localStorage quota limits while preserving rich detail for high-DPI displays.
 */
export async function optimizeImageFile(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.82 } = {}) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (JPG, PNG, WEBP)');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image. Please try a different photo.'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg
        let dataUrl;
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const approxBytes = Math.round((dataUrl.length * 3) / 4);
        resolve({
          dataUrl,
          width,
          height,
          name: file.name,
          originalSizeKb: Math.round(file.size / 1024),
          optimizedSizeKb: Math.round(approxBytes / 1024)
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
