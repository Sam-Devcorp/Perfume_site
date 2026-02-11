export const toFcfaInteger = (value: number): number => {
  return Math.round(value);
};

export const formatFcfa = (value: number): string => {
  const amount = toFcfaInteger(value);
  const sign = amount < 0 ? '-' : '';
  const digits = Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}${digits} FCFA`;
};
