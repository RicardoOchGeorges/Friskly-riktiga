// Date and time formatting utilities

/**
 * Format a date string (YYYY-MM-DD) to a more readable format
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  // If the date is today, return "Today"
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  if (dateString === todayString) {
    return 'Today';
  }
  
  // If the date is yesterday, return "Yesterday"
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  if (dateString === yesterdayString) {
    return 'Yesterday';
  }
  
  // Otherwise, format the date
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a time string (HH:MM:SS) to a more readable format (HH:MM AM/PM)
 * @param timeString Time string in HH:MM:SS format
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hoursNum = parseInt(hours, 10);
  
  // Convert to 12-hour format
  const period = hoursNum >= 12 ? 'PM' : 'AM';
  const hours12 = hoursNum % 12 || 12;
  
  return `${hours12}:${minutes} ${period}`;
}

/**
 * Format a number as a percentage
 * @param value Number to format
 * @param total Total value
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

/**
 * Format a number with commas for thousands
 * @param num Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
