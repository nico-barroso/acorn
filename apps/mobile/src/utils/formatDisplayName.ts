const VALID_CHARS = /[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]/g;

// Called on every keystroke: strip special chars + capitalize first letter
export function sanitizeDisplayName(raw: string): string {
  let text = raw.replace(VALID_CHARS, '').trimStart();
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Called on blur: enforce first word + initial of second word
export function formatDisplayName(raw: string): string {
  const text = raw.replace(VALID_CHARS, '').trim();
  if (!text) return '';

  const words = text.split(/\s+/).filter(Boolean);
  const firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  if (words.length < 2) return firstName;

  const initial = words[1].charAt(0).toUpperCase();
  return `${firstName} ${initial}.`;
}
