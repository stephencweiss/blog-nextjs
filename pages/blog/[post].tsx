import { NextApiRequest, NextPage, NextPageContext } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { Post } from "../../types/post";

import { NOTES_PATH } from "../../constants";

import dictionary from "../../dictionaries/slugDictionary.json";
import {
  Dictionary,
  PostLookup,
  rebuildDictionary,
} from "../../utils/rebuildDictionary";
import { sessionOptions } from "../../utils/withSession";

const dict: Dictionary = rebuildDictionary(dictionary);
const PostPage: NextPage<Post> = (props) => {
  const { content, frontmatter } = props;
  const { title, date } = frontmatter;
  return (
    <>
      <Link href="/">
        <a className="btn btn-back">Go Back</a>
      </Link>
      <div className="card card-page">
        hello, world
        <h1 className="post-title">{title}</h1>
        <div className="post-date">Posted on {date}</div>
        <div className="post-body">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withIronSessionSsr(async function (
  context: NextPageContext
) {
  const { query, req } = context;
  const post = typeof query?.post === "string" ? query.post : "";
  const user = req?.session?.user;

  const specific = dict.get(post) ?? ({} as PostLookup);

  const file = fs.readFileSync(path.join(NOTES_PATH, specific?.fileName));

  const { content, data: frontmatter } = matter(file);

  // if the post is private and the user isn't an admin, show 404
  if (frontmatter?.private && user?.admin !== true) {
    return { notFound: true };
  }

  return { props: { content, frontmatter: { ...frontmatter } } };
},
sessionOptions);

// export const getServerSideProps = withIronSessionSsr(
//   async function getServerSideProps({ req }) {
//     const user = req.session.user;

//     if (user?.admin !== true) {
//       return {
//         notFound: true,
//       };
//     }

//     return {
//       props: {
//         user: req.session.user,
//       },
//     };
//   },
//   sessionOptions
// );

export default PostPage;
