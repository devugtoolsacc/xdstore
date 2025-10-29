export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  { includeCount = true } = {}
) {
  const word = count === 1 ? singular : plural;
  return includeCount ? `${count} ${word}` : word;
}

export function formatPrice(amount: number, showZeroAsNumber: boolean = false) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });

  if (!showZeroAsNumber && amount === 0) {
    return 'Free';
  }
  return formatter.format(amount);
}
