import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    // https://github.com/sergioramos/remark-prism/issues/265
    .use(html, { sanitize: false })
    .use(prism as any)
    .process(markdown);
  return result.toString();
}

export default markdownToHtml;
