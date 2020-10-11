/* eslint react/jsx-props-no-spreading: 0 */
import { get } from "lodash";
import { NextPageContext } from "next";
import React from "react";

import { AuthUserInfoContext } from "../auth/hooks";
import { AuthUserInfo } from "../auth/user";

export interface WithAuthUserInfoCompProps {
  authUserInfo: AuthUserInfo;
}

// Provides an AuthUserInfo prop to the composed component.
export default function withAuthUserInfo(
  ComposedComponent: any,
): (props: WithAuthUserInfoCompProps) => JSX.Element {
  const withAuthUserInfoComp = (props: WithAuthUserInfoCompProps) => {
    const { authUserInfo: AuthUserInfoFromSession, ...otherProps } = props;
    return (
      <AuthUserInfoContext.Consumer>
        {authUserInfo => (
          <ComposedComponent
            {...otherProps}
            authUserInfo={authUserInfo || AuthUserInfoFromSession}
          />
        )}
      </AuthUserInfoContext.Consumer>
    );
  };

  withAuthUserInfoComp.getInitialProps = async (ctx: NextPageContext) => {
    const authUserInfo = get(ctx, "myCustomData.authUserInfo", null);

    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {};
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx);
    }

    return {
      ...composedInitialProps,
      authUserInfo,
    };
  };

  withAuthUserInfoComp.displayName = `WithAuthUserInfo(${ComposedComponent.displayName})`;

  return withAuthUserInfoComp;
}
