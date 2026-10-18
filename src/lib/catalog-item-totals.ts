export function computeQuoteLineTotal(
  quantity: number,
  unitPrice: number,
  percentage: number
): number {
  const priceWithMarkup = unitPrice * (1 + (percentage || 0) / 100);
  return (quantity || 0) * priceWithMarkup;
}
