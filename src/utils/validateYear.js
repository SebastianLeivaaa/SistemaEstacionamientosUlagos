export function validateYear(year) {
  const referenceYear = 1970;
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && parseInt(year) > referenceYear && parseInt(year) <= currentYear;
}
