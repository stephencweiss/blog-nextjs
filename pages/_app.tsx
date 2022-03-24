import "../styles/theme.scss";
import "../styles/reset.scss";
import "../styles/globals.scss";
import "prismjs/themes/prism-okaidia.min.css";

import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { getLayout as getDefaultLayout } from "../layout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => getDefaultLayout(page));

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
