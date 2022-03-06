function createSlug(fileName, frontmatter) {
  return frontmatter?.slug ?? fileName.replace(".md", "");
}

exports.createSlug = createSlug;
