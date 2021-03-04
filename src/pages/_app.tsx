import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import type { AppProps /*, AppContext */ } from "next/app";
import Head from "next/head";
import React from "react";
import AuthProvider from "../auth/components/authProvider";
import SnackbarProvider from "../common/components/snackbarProvider";
import { useAppStyles } from "../common/styles";
import theme from "../common/theme";

export default function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;
  const classes = useAppStyles();

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
          <AuthProvider>
            <SnackbarProvider>
              <Component {...pageProps} />
            </SnackbarProvider>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}
