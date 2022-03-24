import { useEffect, useState } from "react";
import { ExpandedNote } from "types/index";
import { formatDate } from "utils/formatters";

export function useFormattedDates({ date, publish, updated }: ExpandedNote) {
  const [postDate, setPostDate] = useState<string>();
  const [updatedDate, setUpdatedDate] = useState<string>();

  useEffect(() => {
    try {
      setPostDate(formatDate(publish ?? date));
    } catch (e) {}
  }, [date, publish]);

  useEffect(() => {
    try {
      const latest = Array.isArray(updated)
        ? updated[updated.length - 1]
        : updated;
      latest && setUpdatedDate(formatDate(latest));
    } catch (e) {}
  }, [updated]);
  return { postDate, updatedDate };
}
