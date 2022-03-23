import "../styles/reset.scss";
import "../styles/globals.scss";
import "../styles/theme.scss";
import "../styles/theme-application.scss";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
