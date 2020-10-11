/* eslint react/no-danger: 0 */
import { ServerStyleSheets } from "@material-ui/core/styles";
import { get } from "lodash";
import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import React from "react";

import theme from "../themes/theme";
import { AuthUserInfo } from "../utils/auth/user";

export interface CustomDocumentProps extends DocumentProps {
  authUserInfo: AuthUserInfo;
}

export default class CustomDocument extends Document<CustomDocumentProps> {
  render(): JSX.Element {
    // Store initial props from request data that we need to use again on
    // the client. See:
    // https://github.com/zeit/next.js/issues/3043#issuecomment-334521241
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    // Alternatively, you could use a store, like Redux.
    const { authUserInfo } = this.props;
    return (
      <Html>
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <script
            id="__MY_AUTH_USER_INFO"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(authUserInfo, null, 2),
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  static async getInitialProps(ctx: DocumentContext) {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
      });

    // Get the AuthUserInfo object. This is set if the server-rendered page
    // is wrapped in the `withAuthUser` higher-order component.
    const authUserInfo = get(ctx, "myCustomData.authUserInfo", null);
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      authUserInfo,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }
}
