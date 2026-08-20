export function getMediaUrl(url?: string | null): string {
  if (!url) return '';

  // Already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    return url;
  }

  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}