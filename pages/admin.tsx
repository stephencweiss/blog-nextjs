// pages/admin.tsx

import { withIronSessionSsr } from "iron-session/next";
import { Navigation } from "../components";
import { sessionOptions } from "utils";

function Page(props: any) {
  return (
    <>
      <Navigation />
      <code>
        <pre>{JSON.stringify(props, null, 4)}</pre>
      </code>
    </>
  );
}
export default Page;

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (user?.admin !== true) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
  sessionOptions
);
