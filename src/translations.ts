import { get, writable } from 'svelte/store';

export const culture = writable<string>();

export function t<Key extends keyof typeof defaultTranslations>(key: Key) {
  const c = get(culture);

  if (!c) {
    return defaultTranslations[key];
  }

  const translation: string = translations[c][key] || defaultTranslations[key];

  return translation;
}

const defaultTranslations = {
  'Order Summary': 'Order Summary',
  'Total Items': 'Total Items',
  Discount: 'Discount',
  Shipping: 'Shipping',
  'Total incl. VAT': 'Total incl. VAT',
  'Enter Discount Code': 'Enter Discount Code',
  'Discount Code': 'Discount Code',
  'Enter Charity Code': 'Enter Charity Code',
};

const translations: Record<string, Partial<typeof defaultTranslations>> = {
  'sv-SE': {
    'Order Summary': 'Orderdetaljer',
    'Total Items': 'Kundvagnssumma',
    Shipping: 'Fraktkostnad',
    Discount: 'Rabatt',
    'Total incl. VAT': 'Totalt inkl. moms',
    'Enter Discount Code': 'Ange rabattkod',
    'Discount Code': 'Rabattkod',
    'Enter Charity Code': 'Ange välgörenhetskod',
  },
};
