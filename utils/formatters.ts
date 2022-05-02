import { isValidDate } from "./isValidDate";

export const INVALID_DATE = "Invalid Date";
export function formatDate(date: any, options?: Intl.DateTimeFormatOptions) {
  if (!isValidDate(date)) throw new Error(INVALID_DATE);

  const dateOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "long",
    ...options,
  };
  return new Date(date).toLocaleDateString(undefined, dateOptions);
}
