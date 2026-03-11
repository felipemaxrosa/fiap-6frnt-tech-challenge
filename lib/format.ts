const ABBREVIATIONS = [
  { threshold: 1e12, suffix: ' tri' },
  { threshold: 1e9, suffix: ' bi' },
  { threshold: 1e6, suffix: ' mi' },
  { threshold: 1e4, suffix: ' mil' },
];

export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  for (const { threshold, suffix } of ABBREVIATIONS) {
    if (abs >= threshold) {
      const shortened = abs / threshold;
      const formatted = shortened.toLocaleString('pt-BR', {
        minimumFractionDigits: shortened % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1,
      });
      return `${sign}R$ ${formatted}${suffix}`;
    }
  }

  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
