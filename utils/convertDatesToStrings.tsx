import { isValidDate } from "./isValidDate";

export function convertDatesToStrings(frontmatter: any) {
  let newUpdtd = null;
  if (Array.isArray(frontmatter?.updated)) {
    newUpdtd = frontmatter.updated.map((updt: string) =>
      isValidDate(updt) ? new Date(updt).toISOString() : ""
    );
  } else if (isValidDate(frontmatter?.updated)) {
    newUpdtd = [new Date(frontmatter.updated).toISOString()];
  }

  frontmatter.date = isValidDate(frontmatter.date)
    ? new Date(frontmatter.date).toISOString()
    : "";
  frontmatter.draft = isValidDate(frontmatter.date)
    ? new Date(frontmatter.date).toISOString()
    : "";
  frontmatter.publish = isValidDate(frontmatter.publish)
    ? new Date(frontmatter.publish).toISOString()
    : "";

  return { updated: newUpdtd, ...frontmatter };
}
