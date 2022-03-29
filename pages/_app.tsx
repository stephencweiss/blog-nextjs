import "../styles/theme.scss";
import "../styles/reset.scss";
import "../styles/globals.scss";
import "prismjs/themes/prism-solarizedlight.min.css";
import "prismjs/plugins/autolinker/prism-autolinker.min.css";
import "prismjs/plugins/command-line/prism-command-line.min.css";
import "prismjs/plugins/diff-highlight/prism-diff-highlight.min.css";
import "prismjs/plugins/inline-color/prism-inline-color.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";

import { getLayout as getDefaultLayout } from "../layout";
import { AppPropsWithLayout } from "types";
import { ReactElement } from "react";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page: ReactElement) => getDefaultLayout(page));

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
