const DEFAULT_MAX_BYTES = 1.8 * 1024 * 1024; // Stay under typical 2M PHP upload_max_filesize

/**
 * Compress an image file in the browser before multipart upload.
 * Returns the original file if it is already small enough or not an image.
 */
export async function compressImageFile(
  file,
  {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeBytes = DEFAULT_MAX_BYTES,
    outputType = 'image/jpeg',
  } = {}
) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return file;
  }

  if (file.size <= maxSizeBytes && file.type === outputType) {
    return file;
  }

  const blob = await loadAndCompressBlob(file, {
    maxWidth,
    maxHeight,
    quality,
    maxSizeBytes,
    outputType,
  });

  const ext = outputType === 'image/png' ? '.png' : '.jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';

  return new File([blob], `${baseName}${ext}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}

function loadAndCompressBlob(file, options) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const scale = Math.min(
        options.maxWidth / width,
        options.maxHeight / height,
        1
      );
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not prepare image for compression'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      encodeWithQuality(canvas, options.outputType, options.quality, options.maxSizeBytes)
        .then(resolve)
        .catch(reject);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

function encodeWithQuality(canvas, outputType, quality, maxSizeBytes) {
  return new Promise((resolve, reject) => {
    const attempt = (currentQuality) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image compression failed'));
            return;
          }

          if (blob.size > maxSizeBytes && currentQuality > 0.45) {
            attempt(currentQuality - 0.1);
            return;
          }

          resolve(blob);
        },
        outputType,
        currentQuality
      );
    };

    attempt(quality);
  });
}

/** Compress multiple files; skips failures and returns originals as fallback. */
export async function compressImageFiles(files, options) {
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        return await compressImageFile(file, options);
      } catch (err) {
        console.warn('Image compression skipped:', file.name, err);
        return file;
      }
    })
  );
  return results;
}
