import { formatDate, INVALID_DATE } from "./formatters";

describe("Formatters", () => {
  it("formatDate takes a date string and returns it formatted", () => {
    const sample = "2022-01-30T12:00:00.000Z";
    expect(formatDate(sample)).toBe("January 30, 2022");
    const sample2 = "2022-01-30";
    expect(formatDate(sample2)).toBe("January 29, 2022");
  });
  it("formatDate throws an error if the date is not valid", () => {
    const sample = "abc";
    expect(() => formatDate(sample)).toThrow(INVALID_DATE);
  });
});
