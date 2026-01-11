/**
 * Converts BMKG date format to ISO 8601 format
 * BMKG format: "2026-01-08 23:34 UTC"
 * ISO 8601: "2026-01-08T23:34:00Z"
 */
export function parseBMKGDate(bmkgDateString: string): Date {
  // Replace space with 'T', add seconds, replace 'UTC' with 'Z'
  const isoString = bmkgDateString
    .replace(' ', 'T')      // "2026-01-08T23:34 UTC"
    .replace(' UTC', ':00Z'); // "2026-01-08T23:34:00Z"

  return new Date(isoString);
}

/**
 * Format date to Indonesian locale with WIB timezone
 */
export function formatToIndonesian(date: Date): string {
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta' // WIB timezone
  });
}
