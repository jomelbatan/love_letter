export function formatCount(value: number): string {
  if (value < 1000) return value.toString();

  const formatted = (value / 1000).toFixed(1);

  return `${parseFloat(formatted)}k`;
}
export function formatWordS(word: string, count: number) {
  return `${word}${count > 1 ? "s" : ""}`;
}
