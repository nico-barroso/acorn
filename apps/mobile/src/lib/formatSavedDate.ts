export function formatSavedDate(isoDate: string): string {
  const created = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - created, 0);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Hace unos segundos';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Hace ${diffDays} dias`;

  return new Date(isoDate).toLocaleDateString();
}
