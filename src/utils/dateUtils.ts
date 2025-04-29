import { format, addDays, isBefore, parseISO } from 'date-fns';


// Function to parse the time and combine with date
export function combineDateTime(date: string, time: string): Date {
  // Ensure that the time is in 24-hour format for accurate parsing
  const [hour, minuteAndPeriod] = time.split(':');
  const [minute, period] = minuteAndPeriod.split(' ');
  let hour24 = parseInt(hour, 10);

  // Convert AM/PM to 24-hour format
  if (period === 'PM' && hour24 < 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0; // Convert 12 AM to 00:00
  }

  // Construct the combined date-time string (ISO format)
  const dateTimeString = `${date}T${String(hour24).padStart(2, '0')}:${minute}:00`;

  return parseISO(dateTimeString); // Return Date object
}

export function generateNextDates(days: number): string[] {
  return Array.from({ length: days }, (_, i) => 
    format(addDays(new Date(), i), 'yyyy-MM-dd')
  );
}

export function formatDateLabel(date: string): string {
  const dateObj = new Date(date);
  return format(dateObj, 'EEE, MMM d');
}

export function isShowtimeAvailable(time: string, date: string): boolean {
  const [hours, minutes] = time.split(':').map(Number);
  const showtime = new Date(date);
  showtime.setHours(hours, minutes, 0, 0); // set full time properly

  return !isBefore(showtime, new Date());
}