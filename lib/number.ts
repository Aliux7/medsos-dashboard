export function formatNumber(value: number | string): string { 
  return new Intl.NumberFormat("de-DE", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}
