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
  'united states': 'America/New_York',
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
  'ireland': 'Europe/Dublin',
  'new zealand': 'Pacific/Auckland',
  'thailand': 'Asia/Bangkok',
  'vietnam': 'Asia/Ho_Chi_Minh',
  'singapore': 'Asia/Singapore',
  'malaysia': 'Asia/Kuala_Lumpur',
  'indonesia': 'Asia/Jakarta',
  'philippines': 'Asia/Manila',
  'south korea': 'Asia/Seoul',
  'uae': 'Asia/Dubai',
  'saudi arabia': 'Asia/Riyadh',
  'israel': 'Asia/Jerusalem',
  'ukraine': 'Europe/Kyiv',
  'czech republic': 'Europe/Prague',
  'hungary': 'Europe/Budapest',
  'romania': 'Europe/Bucharest',
  'colombia': 'America/Bogota',
  'chile': 'America/Santiago',
  'peru': 'America/Lima',

  // Cities
  'lisbon': 'Europe/Lisbon',
  'lisboa': 'Europe/Lisbon',
  'porto': 'Europe/Lisbon',
  'faro': 'Europe/Lisbon',
  'algarve': 'Europe/Lisbon',
  'madeira': 'Atlantic/Madeira',
  'azores': 'Atlantic/Azores',
  'funchal': 'Atlantic/Madeira',
  'berlin': 'Europe/Berlin',
  'munich': 'Europe/Berlin',
  'münchen': 'Europe/Berlin',
  'hamburg': 'Europe/Berlin',
  'frankfurt': 'Europe/Berlin',
  'stuttgart': 'Europe/Berlin',
  'augsburg': 'Europe/Berlin',
  'cologne': 'Europe/Berlin',
  'köln': 'Europe/Berlin',
  'düsseldorf': 'Europe/Berlin',
  'dortmund': 'Europe/Berlin',
  'essen': 'Europe/Berlin',
  'leipzig': 'Europe/Berlin',
  'bremen': 'Europe/Berlin',
  'dresden': 'Europe/Berlin',
  'hannover': 'Europe/Berlin',
  'nuremberg': 'Europe/Berlin',
  'nürnberg': 'Europe/Berlin',
  'duisburg': 'Europe/Berlin',
  'bochum': 'Europe/Berlin',
  'wuppertal': 'Europe/Berlin',
  'bielefeld': 'Europe/Berlin',
  'bonn': 'Europe/Berlin',
  'muenster': 'Europe/Berlin',
  'münster': 'Europe/Berlin',
  'karlsruhe': 'Europe/Berlin',
  'mannheim': 'Europe/Berlin',
  'kiel': 'Europe/Berlin',
  'london': 'Europe/London',
  'manchester': 'Europe/London',
  'birmingham': 'Europe/London',
  'glasgow': 'Europe/London',
  'liverpool': 'Europe/London',
  'edinburgh': 'Europe/London',
  'dublin': 'Europe/Dublin',
  'paris': 'Europe/Paris',
  'lyon': 'Europe/Paris',
  'marseille': 'Europe/Paris',
  'nice': 'Europe/Paris',
  'madrid': 'Europe/Madrid',
  'barcelona': 'Europe/Madrid',
  'valencia': 'Europe/Madrid',
  'seville': 'Europe/Madrid',
  'rome': 'Europe/Rome',
  'roma': 'Europe/Rome',
  'milan': 'Europe/Rome',
  'milano': 'Europe/Rome',
  'naples': 'Europe/Rome',
  'venice': 'Europe/Rome',
  'amsterdam': 'Europe/Amsterdam',
  'rotterdam': 'Europe/Amsterdam',
  'brussels': 'Europe/Brussels',
  'bruxelles': 'Europe/Brussels',
  'antwerp': 'Europe/Brussels',
  'vienna': 'Europe/Vienna',
  'wien': 'Europe/Vienna',
  'zurich': 'Europe/Zurich',
  'zürich': 'Europe/Zurich',
  'geneva': 'Europe/Zurich',
  'stockholm': 'Europe/Stockholm',
  'oslo': 'Europe/Oslo',
  'copenhagen': 'Europe/Copenhagen',
  'helsinki': 'Europe/Helsinki',
  'athens': 'Europe/Athens',
  'warsaw': 'Europe/Warsaw',
  'prague': 'Europe/Prague',
  'budapest': 'Europe/Budapest',
  'bucharest': 'Europe/Bucharest',
  'new york': 'America/New_York',
  'nyc': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'la': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'houston': 'America/Chicago',
  'phoenix': 'America/Phoenix',
  'philadelphia': 'America/New_York',
  'san antonio': 'America/Chicago',
  'san diego': 'America/Los_Angeles',
  'dallas': 'America/Chicago',
  'san jose': 'America/Los_Angeles',
  'austin': 'America/Chicago',
  'jacksonville': 'America/New_York',
  'fort worth': 'America/Chicago',
  'columbus': 'America/New_York',
  'san francisco': 'America/Los_Angeles',
  'sf': 'America/Los_Angeles',
  'charlotte': 'America/New_York',
  'indianapolis': 'America/New_York',
  'seattle': 'America/Los_Angeles',
  'denver': 'America/Denver',
  'washington': 'America/New_York',
  'boston': 'America/New_York',
  'miami': 'America/New_York',
  'atlanta': 'America/New_York',
  'toronto': 'America/Toronto',
  'montreal': 'America/Toronto',
  'vancouver': 'America/Vancouver',
  'calgary': 'America/Edmonton',
  'mexico city': 'America/Mexico_City',
  'sao paulo': 'America/Sao_Paulo',
  'rio de janeiro': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  'santiago': 'America/Santiago',
  'lima': 'America/Lima',
  'bogota': 'America/Bogota',
  'tokyo': 'Asia/Tokyo',
  'osaka': 'Asia/Tokyo',
  'kyoto': 'Asia/Tokyo',
  'seoul': 'Asia/Seoul',
  'shanghai': 'Asia/Shanghai',
  'beijing': 'Asia/Shanghai',
  'hong kong': 'Asia/Hong_Kong',
  'jakarta': 'Asia/Jakarta',
  'manila': 'Asia/Manila',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'bangalore': 'Asia/Kolkata',
  'kolkata': 'Asia/Kolkata',
  'dubai': 'Asia/Dubai',
  'abu dhabi': 'Asia/Dubai',
  'riyadh': 'Asia/Riyadh',
  'jerusalem': 'Asia/Jerusalem',
  'tel aviv': 'Asia/Jerusalem',
  'istanbul': 'Europe/Istanbul',
  'ankara': 'Europe/Istanbul',
  'izmir': 'Europe/Istanbul',
  'moscow': 'Europe/Moscow',
  'saint petersburg': 'Europe/Moscow',
  'cairo': 'Africa/Cairo',
  'johannesburg': 'Africa/Johannesburg',
  'cape town': 'Africa/Johannesburg',
  'nairobi': 'Africa/Nairobi',
  'lagos': 'Africa/Lagos',
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'brisbane': 'Australia/Sydney',
  'perth': 'Australia/Perth',
  'adelaide': 'Australia/Adelaide',
  'darwin': 'Asia/Darwin',
  'hobart': 'Australia/Hobart',
  'canberra': 'Australia/Sydney',
  'vladivostok': 'Asia/Vladivostok',
  'yakutsk': 'Asia/Yakutsk',
  'irkutsk': 'Asia/Irkutsk',
  'novosibirsk': 'Asia/Novosibirsk',
  'omsk': 'Asia/Omsk',
  'yekaterinburg': 'Asia/Yekaterinburg',
  'samara': 'Europe/Samara',
  'kaliningrad': 'Europe/Kaliningrad',
  'minsk': 'Europe/Minsk',
  'riga': 'Europe/Riga',
  'tallinn': 'Europe/Tallinn',
  'vilnius': 'Europe/Vilnius',
  'sofia': 'Europe/Sofia',
  'belgrade': 'Europe/Belgrade',
  'zagreb': 'Europe/Belgrade',
  'ljubljana': 'Europe/Belgrade',
  'sarajevo': 'Europe/Belgrade',
  'skopje': 'Europe/Belgrade',
  'bratislava': 'Europe/Prague',
  'bergen': 'Europe/Oslo',
  'stavanger': 'Europe/Oslo',
  'trondheim': 'Europe/Oslo',
  'gothenburg': 'Europe/Stockholm',
  'malmo': 'Europe/Stockholm',
  'uppsala': 'Europe/Stockholm',
  'turku': 'Europe/Helsinki',
  'tampere': 'Europe/Helsinki',
  'reykjavik': 'Atlantic/Reykjavik',
  'casablanca': 'Africa/Casablanca',
  'rabat': 'Africa/Casablanca',
  'tunis': 'Africa/Tunis',
  'algiers': 'Africa/Algiers',
  'tripoli': 'Africa/Tripoli',
  'khartoum': 'Africa/Khartoum',
  'addis ababa': 'Africa/Addis_Ababa',
  'mogadishu': 'Africa/Mogadishu',
  'dar es salaam': 'Africa/Dar_es_Salaam',
  'kampala': 'Africa/Kampala',
  'kigali': 'Africa/Kigali',
  'luanda': 'Africa/Luanda',
  'kinshasa': 'Africa/Kinshasa',
  'harare': 'Africa/Harare',
  'lusaka': 'Africa/Lusaka',
  'gaborone': 'Africa/Gaborone',
  'windhoek': 'Africa/Windhoek',
  'dakar': 'Africa/Dakar',
  'accra': 'Africa/Accra',
  'abidjan': 'Africa/Abidjan',
  'tehran': 'Asia/Tehran',
  'baghdad': 'Asia/Baghdad',
  'kuwait city': 'Asia/Kuwait',
  'doha': 'Asia/Qatar',
  'manama': 'Asia/Bahrain',
  'muscat': 'Asia/Muscat',
  'karachi': 'Asia/Karachi',
  'lahore': 'Asia/Karachi',
  'islamabad': 'Asia/Karachi',
  'dhaka': 'Asia/Dhaka',
  'colombo': 'Asia/Colombo',
  'kathmandu': 'Asia/Kathmandu',
  'tashkent': 'Asia/Tashkent',
  'almaty': 'Asia/Almaty',
  'bishkek': 'Asia/Bishkek',
  'ashgabat': 'Asia/Ashgabat',
  'dushanbe': 'Asia/Dushanbe',
  'ulaanbaatar': 'Asia/Ulaanbaatar',
  'yangon': 'Asia/Yangon',
  'phnom penh': 'Asia/Phnom_Penh',
  'vientiane': 'Asia/Vientiane',
  'bandar seri begawan': 'Asia/Brunei',
  'taipei': 'Asia/Taipei',
  'macau': 'Asia/Macau',
  'auckland': 'Pacific/Auckland',
  'wellington': 'Pacific/Auckland',
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

  // 3. Try to find a match in mapping (more robust)
  for (const [key, value] of Object.entries(tzMapping)) {
    // Check for exact match, or if the key is a word in the input
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (normalized === key || regex.test(normalized)) {
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

