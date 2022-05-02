import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { PostLookup, removeUndefined, sessionOptions } from "utils";
import { extractNoteData, markdownToHtml } from "../../../utils/serverUtils";
import dictionary from "../../../public/resources/slugDictionary.json";
import fileDictionary from "../../../public/resources/fileNameDictionary.json";
import { Dictionary, rebuildDictionary } from "utils";
import { ExpandedNote, User } from "types/index";

const dict: Dictionary = rebuildDictionary(dictionary);
const fnDict: Dictionary = rebuildDictionary(fileDictionary);

export default withIronSessionApiRoute(postRoute, sessionOptions);
function enhanceBacklinks(note: ExpandedNote, user?: User): ExpandedNote[] {
  const backlinks = note.backlinks ?? [];

  if (backlinks?.length === 0) {
    return [];
  }

  const base = backlinks.map((b) => b.file?.base);
  const files = [...new Set(base)];

  return files
    .map((file) => fnDict.get(file))
    .filter(removeUndefined)
    .filter((item) => filterPrivate(item, user))
    .map((backlink) => extractNoteData(backlink.fileName, true));
}

function filterPrivate(item: { isPrivate: boolean }, user?: User) {
  return user?.admin ? true : !item.isPrivate;
}

async function postRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }
  const { post } = req.query;
  if (Array.isArray(post)) {
    res.status(400).send({ message: "Supports only post at a time" });
    return;
  }

  const { user } = req.session;

  // dict.get(post)
  const specific = dict.get(post) ?? ({} as PostLookup);
  const note = extractNoteData(specific.fileName);
  // if the post is private and the user isn't an admin, show 404
  if (note?.isPrivate && user?.admin !== true) {
    console.log(`private and not logged in`);
    return res.status(404).send({ notFound: true });
  }

  const content = await markdownToHtml(note.content || "");

  const expandedNote = {
    ...note,
    content,
    enhancedBacklinks: enhanceBacklinks(note, user),
  };

  console.log({ query: req.query, session: req.session });
  res.status(200).send({ post: expandedNote }); // const { password } = JSON.parse(req.body);
}
