import { DateTime } from 'luxon';

// Mapping of common abbreviations, cities, and countries to IANA timezones
export const tzMapping: Record<string, string> = {
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
  
  // Countries
  'portugal': 'Europe/Lisbon',
  'germany': 'Europe/Berlin',
  'france': 'Europe/Paris',
  'spain': 'Europe/Madrid',
  'italy': 'Europe/Rome',
  'united kingdom': 'Europe/London',
  'uk': 'Europe/London',
  'usa': 'America/New_York',
  'canada': 'America/Toronto',
  'japan': 'Asia/Tokyo',
  'china': 'Asia/Shanghai',
  'india': 'Asia/Kolkata',
  'brazil': 'America/Sao_Paulo',
  'australia': 'Australia/Sydney',
  'russia': 'Europe/Moscow',
  'turkey': 'Europe/Istanbul',
  'egypt': 'Africa/Cairo',
  'south africa': 'Africa/Johannesburg',
  'mexico': 'America/Mexico_City',
  'argentina': 'America/Argentina/Buenos_Aires',
  'denmark': 'Europe/Copenhagen',
  'belgium': 'Europe/Brussels',
  'switzerland': 'Europe/Zurich',
  'austria': 'Europe/Vienna',
  'netherlands': 'Europe/Amsterdam',
  'sweden': 'Europe/Stockholm',
  'norway': 'Europe/Oslo',
  'finland': 'Europe/Helsinki',
  'greece': 'Europe/Athens',
  'poland': 'Europe/Warsaw',

  // Cities
  'lisbon': 'Europe/Lisbon',
  'lisboa': 'Europe/Lisbon',
  'porto': 'Europe/Lisbon',
  'new york': 'America/New_York',
  'london': 'Europe/London',
  'paris': 'Europe/Paris',
  'berlin': 'Europe/Berlin',
  'munich': 'Europe/Berlin',
  'münchen': 'Europe/Berlin',
  'hamburg': 'Europe/Berlin',
  'frankfurt': 'Europe/Berlin',
  'stuttgart': 'Europe/Berlin',
  'augsburg': 'Europe/Berlin',
  'tokyo': 'Asia/Tokyo',
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'copenhagen': 'Europe/Copenhagen',
  'københavn': 'Europe/Copenhagen',
  'brussels': 'Europe/Brussels',
  'bruxelles': 'Europe/Brussels',
  'brussel': 'Europe/Brussels',
  'madrid': 'Europe/Madrid',
  'barcelona': 'Europe/Madrid',
  'rome': 'Europe/Rome',
  'roma': 'Europe/Rome',
  'milan': 'Europe/Rome',
  'milano': 'Europe/Rome',
  'zurich': 'Europe/Zurich',
  'zürich': 'Europe/Zurich',
  'vienna': 'Europe/Vienna',
  'wien': 'Europe/Vienna',
  'amsterdam': 'Europe/Amsterdam',
  'stockholm': 'Europe/Stockholm',
  'oslo': 'Europe/Oslo',
  'helsinki': 'Europe/Helsinki',
  'athens': 'Europe/Athens',
  'warsaw': 'Europe/Warsaw',
  'los angeles': 'America/Los_Angeles',
  'san francisco': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'toronto': 'America/Toronto',
  'vancouver': 'America/Vancouver',
  'dubai': 'Asia/Dubai',
  'singapore': 'Asia/Singapore',
  'hong kong': 'Asia/Hong_Kong',
  'shanghai': 'Asia/Shanghai',
  'beijing': 'Asia/Shanghai',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'moscow': 'Europe/Moscow',
  'istanbul': 'Europe/Istanbul',
  'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  'mexico city': 'America/Mexico_City',
  'johannesburg': 'Africa/Johannesburg',
  'cairo': 'Africa/Cairo',
  'bangkok': 'Asia/Bangkok',
  'seoul': 'Asia/Seoul',
  'jakarta': 'Asia/Jakarta',
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
    if (normalized === key || normalized.startsWith(key + ' ') || normalized.endsWith(' ' + key)) {
      return value;
    }
  }

  // 4. Check if it's a valid IANA timezone
  try {
    if (DateTime.local().setZone(input).isValid) {
      return input;
    }
  } catch (e) {
    // Ignore invalid zones
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
  // Improved regex to find time and timezone in text
  // Matches: 10:00, 10:00am, 10am, 10:00 am, 10.00, 10 Uhr
  const timeRegex = /(\d{1,2}(?:[:.]\d{2})?(?:\s?[ap]m|\s?uhr)?)/i;
  const timeMatch = text.match(timeRegex);
  
  if (!timeMatch) return null;
  
  const timeStr = timeMatch[1];
  // Normalize time string for parsing (replace . with : and remove 'uhr')
  const normalizedTime = timeStr.replace('.', ':').replace(/uhr/i, '').trim();

  // Remove the time from the text to find the zone
  const remainingText = text.replace(timeStr, '').trim();
  
  const zone = parseTimezoneInput(remainingText);
  
  if (zone) {
    return { time: normalizedTime, zone };
  }
  
  return null;
}

export function parseDateTimeWithZone(timeStr: string, zone: string): DateTime | null {
  // Try parsing the time string in the given zone
  // e.g., "10:00", "10:00am", "10am", "10"
  
  let dt = DateTime.fromFormat(timeStr, 'HH:mm', { zone });
  if (dt.isValid) return dt;

  dt = DateTime.fromFormat(timeStr, 'H:mm', { zone });
  if (dt.isValid) return dt;
  
  dt = DateTime.fromFormat(timeStr, 'h:mm a', { zone });
  if (dt.isValid) return dt;
  
  dt = DateTime.fromFormat(timeStr, 'ha', { zone });
  if (dt.isValid) return dt;
  
  dt = DateTime.fromFormat(timeStr, 'h a', { zone });
  if (dt.isValid) return dt;

  dt = DateTime.fromFormat(timeStr, 'H', { zone });
  if (dt.isValid) return dt;
  
  return null;
}

