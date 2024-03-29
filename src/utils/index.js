export const priceFormat = (value, fraction = 4) => (new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: fraction, // (causes 2500.99 to be printed as $2,501)
})).format(value);

export const priceCompact = (value) => (new Intl.NumberFormat('en', { notation: 'compact' })).format(value)

export const tooltipNumberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
});

export const yAxisLabelNumberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
});

export const crosshairLabelNumberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
});