import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import nookies from "nookies";
import { ParsedUrlQuery } from "querystring";
import { firebaseAdmin } from "../../firebase/firebaseAdmin";

export type GetServerSideWithTokenProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (
  context: GetServerSidePropsContext<Q> & {
    token?: firebaseAdmin.auth.DecodedIdToken;
  },
) => Promise<GetServerSidePropsResult<P>>;

export interface WithTokenProps {
  getter?: GetServerSideWithTokenProps;
  redirect?: boolean;
}

const withToken = (props?: WithTokenProps): GetServerSideProps => {
  const { getter = async () => ({ props: {} }), redirect } = props ?? {};

  return async ctx => {
    try {
      const cookies = nookies.get(ctx);

      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      return getter({ ...ctx, token });
    } catch (err) {
      // either the `token` cookie didn't exist
      // or token verification failed
      // either way: redirect to the login page
      // either the `token` cookie didn't exist
      // or token verification failed
      // either way: redirect to the login page
      if (redirect) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
          // `as never` is required for correct type inference
          // by InferGetServerSidePropsType below
          props: {} as never,
        };
      }
      return getter(ctx);
    }
  };
};

export default withToken;
