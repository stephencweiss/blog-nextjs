import "../styles/theme.scss";
import "../styles/reset.scss";
import "../styles/globals.scss";
import "prismjs/themes/prism-solarizedlight.css";

import { getLayout as getDefaultLayout } from "../layout";
import { AppPropsWithLayout } from "types";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => getDefaultLayout(page));

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
