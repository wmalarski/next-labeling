/* eslint react/jsx-props-no-spreading: 0 */
import { get, set } from "lodash";
import { NextPageContext } from "next";
import React from "react";
import { AuthUserInfoContext, useFirebaseAuth } from "../../auth/hooks";
import {
  AuthUserInfo,
  createAuthUser,
  createAuthUserInfo,
} from "../../auth/user";

export interface WithAuthUserCompProps {
  authUserInfo: AuthUserInfo;
}

export function getAuthUserInfo(ctx: NextPageContext): AuthUserInfo {
  const { req, res } = ctx;

  if (typeof window === "undefined") {
    // If server-side, get AuthUserInfo from the session in the request.
    // Don't include server middleware in the client JS bundle. See:
    // https://arunoda.me/blog/ssr-and-server-only-modules
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { addSession } = require("../../middleware/cookieSession");
    addSession(req, res);
    return createAuthUserInfo({
      firebaseUser: get(req, "session.decodedToken", null),
      token: get(req, "session.token", null),
    });
  } else {
    // If client-side, get AuthUserInfo from stored data. We store it
    // in _document.js. See:
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    try {
      const document = window?.document;
      const textContent = document?.getElementById("__MY_AUTH_USER_INFO")
        ?.textContent;
      const jsonData = textContent ? JSON.parse(textContent) : null;
      if (jsonData) {
        return jsonData;
      } else {
        // Use the default (unauthed) user info if there's no data.
        return createAuthUserInfo();
      }
    } catch (e) {
      // If there's some error, use the default (unauthed) user info.
      return createAuthUserInfo();
    }
  }
}

// Gets the authenticated user from the Firebase JS SDK, when client-side,
// or from the request object, when server-side. Add the authUserInfo to
// context.
export default function withAuthUser(
  ComposedComponent: any,
): (props: WithAuthUserCompProps) => JSX.Element {
  const WithAuthUserComp = (props: WithAuthUserCompProps) => {
    const { authUserInfo, ...otherProps } = props;

    // We'll use the authed user from client-side auth (Firebase JS SDK)
    // when available. On the server side, we'll use the authed user from
    // the session. This allows us to server-render while also using Firebase's
    // client-side auth functionality.
    const { user: firebaseUser } = useFirebaseAuth();
    const authUserFromClient = createAuthUser(firebaseUser);
    const { authUser: authUserFromSession, token } = authUserInfo;
    const authUser = authUserFromClient || authUserFromSession || null;

    return (
      <AuthUserInfoContext.Provider value={{ authUser, token }}>
        <ComposedComponent {...otherProps} />
      </AuthUserInfoContext.Provider>
    );
  };

  WithAuthUserComp.getInitialProps = async (ctx: NextPageContext) => {
    // Get the AuthUserInfo object.
    const authUserInfo = getAuthUserInfo(ctx);

    // Explicitly add the user to a custom prop in the getInitialProps
    // context for ease of use in child components.
    set(ctx, "myCustomData.authUserInfo", authUserInfo);

    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {};
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx);
    }

    return {
      ...composedInitialProps,
      authUserInfo: authUserInfo,
    };
  };

  WithAuthUserComp.displayName = `WithAuthUser(${ComposedComponent.displayName})`;

  return WithAuthUserComp;
}
