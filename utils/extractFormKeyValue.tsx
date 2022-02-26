import * as React from "react";

export function extractFormKeyValue(
  event: React.FormEvent<HTMLFormElement>,
  targetKey: string
): FormDataEntryValue[] {
  const data = new FormData(event.target as HTMLFormElement);
  const entries = [...data.entries()];
  return entries
    .filter(([key]) => key === targetKey)
    .map(([_, value]) => value);
}
