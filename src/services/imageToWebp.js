/**
 * Convert image to WebP format with optional resizing
 * @param {File} file - The image file to convert
 * @param {Object} options - Conversion options
 * @param {number} options.quality - Quality of the output (0-1), default 0.8
 * @param {number} options.maxWidth - Maximum width in pixels, default null (no resize)
 * @param {number} options.maxHeight - Maximum height in pixels, default null (no resize)
 * @returns {Promise<File>} - The converted WebP file
 */
export async function convertImageToWebP(file, options = {}) {
  const { quality = 0.8, maxWidth = null, maxHeight = null } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please provide a valid image file.'));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Calculate new dimensions if maxWidth or maxHeight is specified
        let width = img.width;
        let height = img.height;

        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;

          if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }

          if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Conversion failed.'));
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: 'image/webp',
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}