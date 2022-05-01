import "../styles/theme.scss";
import "../styles/reset.scss";
import "../styles/globals.scss";
import "prismjs/themes/prism-solarizedlight.min.css";
import "prismjs/plugins/autolinker/prism-autolinker.min.css";
import "prismjs/plugins/command-line/prism-command-line.min.css";
import "prismjs/plugins/diff-highlight/prism-diff-highlight.min.css";
import "prismjs/plugins/inline-color/prism-inline-color.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
