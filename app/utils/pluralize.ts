/**
 * Simple pluralization helper that just adds 's' for plural
 * @param count - The number to check for pluralization
 * @returns 's' if count is not 1, empty string otherwise
 */
export function getPluralSuffix(count: number): string {
  return count !== 1 ? 's' : ''
}
