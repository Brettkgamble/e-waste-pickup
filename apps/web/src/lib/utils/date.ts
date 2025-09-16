/**
 * Format a date string consistently for both server and client rendering
 * This prevents hydration mismatches by using a consistent format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    // Use a consistent format that doesn't depend on locale
    const isoString = date.toISOString();
    const datePart = isoString.split('T')[0];
    return datePart || dateString; // Fallback to original if split fails
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a date string for display with a more readable format
 * Still consistent between server and client
 */
export function formatDisplayDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    // Use a consistent format: MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting display date:', error);
    return dateString;
  }
}
