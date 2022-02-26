// pages/admin.tsx

import { withIronSessionSsr } from "iron-session/next";
import { NavBar } from "../components/NavBar";
import { sessionOptions } from "../utils/withSession";

function Page(props: any) {
  return (
    <>
      <NavBar />
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
