import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, Theme, ThemeProvider } from "@material-ui/core/styles";
import Head from "next/head";
import React from "react";

import theme from "../src/themes/theme";

import type { AppProps /*, AppContext */ } from "next/app";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}));

export default function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;
  const classes = useStyles();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <div className={classes.root}>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}
