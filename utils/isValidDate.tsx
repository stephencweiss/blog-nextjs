export function isValidDate(date: any) {
  return !Number.isNaN(Date.parse(date));
}
