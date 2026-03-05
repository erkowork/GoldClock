import { DateTime } from 'luxon';

// Mapping of common abbreviations and cities to IANA timezones
const tzMapping: Record<string, string> = {
  // Abbreviations
  'est': 'America/New_York',
  'edt': 'America/New_York',
  'cst': 'America/Chicago',
  'cdt': 'America/Chicago',
  'mst': 'America/Denver',
  'mdt': 'America/Denver',
  'pst': 'America/Los_Angeles',
  'pdt': 'America/Los_Angeles',
  'gmt': 'Europe/London',
  'bst': 'Europe/London',
  'cet': 'Europe/Berlin',
  'cest': 'Europe/Berlin',
  'jst': 'Asia/Tokyo',
  'aest': 'Australia/Sydney',
  'aedt': 'Australia/Sydney',
  
  // Cities
  'new york': 'America/New_York',
  'london': 'Europe/London',
  'paris': 'Europe/Paris',
  'berlin': 'Europe/Berlin',
  'tokyo': 'Asia/Tokyo',
  'sydney': 'Australia/Sydney',
  'copenhagen': 'Europe/Copenhagen',
  'københavn': 'Europe/Copenhagen',
  'brussels': 'Europe/Brussels',
  'bruxelles': 'Europe/Brussels',
  'brussel': 'Europe/Brussels',
  'madrid': 'Europe/Madrid',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'toronto': 'America/Toronto',
  'dubai': 'Asia/Dubai',
  'singapore': 'Asia/Singapore',
  'hong kong': 'Asia/Hong_Kong',
  'shanghai': 'Asia/Shanghai',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'moscow': 'Europe/Moscow',
  'istanbul': 'Europe/Istanbul',
  'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  'mexico city': 'America/Mexico_City',
  'johannesburg': 'Africa/Johannesburg',
  'cairo': 'Africa/Cairo',
};

export function parseTimezoneInput(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  
  // 1. Check direct mapping
  if (tzMapping[normalized]) {
    return tzMapping[normalized];
  }

  // 2. Check for UTC offset (e.g., UTC-5, UTC+01:00)
  const utcMatch = normalized.match(/utc([+-]\d{1,2})(?::(\d{2}))?/i);
  if (utcMatch) {
    let hours = parseInt(utcMatch[1], 10);
    let minutes = utcMatch[2] ? parseInt(utcMatch[2], 10) : 0;
    
    const sign = hours >= 0 ? '+' : '-';
    const absHours = Math.abs(hours).toString().padStart(2, '0');
    const absMinutes = minutes.toString().padStart(2, '0');
    return `UTC${sign}${absHours}:${absMinutes}`;
  }

  // 3. Try to find a partial match in mapping
  for (const [key, value] of Object.entries(tzMapping)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  // 4. Check if it's a valid IANA timezone
  if (DateTime.local().setZone(input).isValid) {
    return input;
  }

  return null;
}

export function getGermanTime(date: DateTime = DateTime.local()): DateTime {
  return date.setZone('Europe/Berlin');
}

export function formatTime(date: DateTime, use24h: boolean): string {
  return date.toFormat(use24h ? 'HH:mm' : 'hh:mm a');
}

export function extractTimeAndZone(text: string): { time: string, zone: string } | null {
  // Simple regex to find time and timezone in text (e.g. "Meeting tomorrow 10:00 PST" or "10:00 New York")
  // Matches: 10:00, 10:00am, 10am, 10:00 am
  const timeRegex = /(\d{1,2}(?::\d{2})?(?:\s?[ap]m)?)/i;
  const timeMatch = text.match(timeRegex);
  
  if (!timeMatch) return null;
  
  const timeStr = timeMatch[1];
  // Remove the time from the text to find the zone
  const remainingText = text.replace(timeStr, '').trim();
  
  const zone = parseTimezoneInput(remainingText);
  
  if (zone) {
    return { time: timeStr, zone };
  }
  
  return null;
}

export function parseDateTimeWithZone(timeStr: string, zone: string): DateTime | null {
  // Try parsing the time string in the given zone
  // e.g., "10:00", "10:00am", "10am"
  
  let dt = DateTime.fromFormat(timeStr, 'HH:mm', { zone });
  if (dt.isValid) return dt;
  
  dt = DateTime.fromFormat(timeStr, 'h:mm a', { zone });
  if (dt.isValid) return dt;
  
  dt = DateTime.fromFormat(timeStr, 'ha', { zone });
  if (dt.isValid) return dt;
  
  dt = DateTime.fromFormat(timeStr, 'h a', { zone });
  if (dt.isValid) return dt;
  
  return null;
}

