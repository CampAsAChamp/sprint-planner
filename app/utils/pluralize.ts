/**
 * Utility function to pluralize words based on count
 * @param count - The number to check for pluralization
 * @param singular - The singular form of the word
 * @param plural - The plural form of the word (defaults to singular + 's')
 * @returns The appropriate form based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular
  }
  return plural || `${singular}s`
}

/**
 * Simple pluralization helper that just adds 's' for plural
 * @param count - The number to check for pluralization
 * @returns 's' if count is not 1, empty string otherwise
 */
export function getPluralSuffix(count: number): string {
  return count !== 1 ? 's' : ''
}
