// Exchange rate: UGX to USD (approximate)
const UGX_TO_USD_RATE = 3700;

/**
 * Converts UGX price to USD and formats it
 * @param ugxPrice - Price in Ugandan Shillings
 * @returns Formatted USD price string
 */
export function formatPrice(ugxPrice: number): string {
  const usdPrice = ugxPrice / UGX_TO_USD_RATE;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdPrice);
}

/**
 * Converts UGX to USD
 * @param ugxAmount - Amount in Ugandan Shillings
 * @returns Amount in US Dollars
 */
export function ugxToUsd(ugxAmount: number): number {
  return ugxAmount / UGX_TO_USD_RATE;
}

/**
 * Formats a USD amount as currency string (no conversion)
 * @param usdAmount - Amount already in US Dollars
 * @returns Formatted USD price string
 */
export function formatUsd(usdAmount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
}
