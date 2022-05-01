import { unified } from "unified";
import mdParse from "remark-parse";
// import { remark } from "remark";
// import html from "remark-html";
import prism from "remark-prism";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";

export async function markdownToHtml(content: string) {
  return await unified()
    .use(mdParse)
    .use(prism)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkStringify)
    .process(content);
  // const result = engine.parse(content)

  // const result = await remark()
  //   // https://github.com/sergioramos/remark-prism/issues/265
  //   .use(html, { sanitize: false })
  //   .use(prism)
  //   .process(markdown);
  // return result.toString();
}
