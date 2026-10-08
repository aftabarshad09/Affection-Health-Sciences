// Returns a faster-loading version of a Cloudinary image URL by inserting
// on-the-fly transformations: auto format (WebP/AVIF), auto quality, and a
// capped width. Drastically reduces image weight (often 5-10x) with no visible
// quality loss. Non-Cloudinary URLs (or empty) are returned unchanged.
export function optimizedImage(url, width = 500) {
  if (!url || typeof url !== 'string') return url;
  const marker = '/upload/';
  const i = url.indexOf(marker);
  if (i === -1) return url; // not a Cloudinary upload URL
  // Avoid double-transforming if one is already present.
  const after = url.slice(i + marker.length);
  if (/^(f_|q_|w_|c_)/.test(after)) return url;
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,w_${width}/${after}`;
}
