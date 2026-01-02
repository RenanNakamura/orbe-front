export function tenantAndNameToColor(tenantId: string, name: string): string {
  const input = `${tenantId}:${name}`.toLowerCase();

  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 65%, 50%)`;
}
