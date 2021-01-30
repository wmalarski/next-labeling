import "firebase/auth";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import withToken from "../auth/functions/withToken";
import useAuth from "../auth/hooks/useAuth";
import Footer from "../common/components/footer";
import Header from "../common/components/header";
import { initializeFirebase } from "../firebase/firebaseClient";

initializeFirebase();

export default function Account(): JSX.Element {
  const router = useRouter();
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  return (
    <>
      {!authUser ? (
        <></>
      ) : (
        <>
          <Header />
          <div>
            <label htmlFor="displayName">display name</label>{" "}
            <Link href="/account/update-name">
              <a>[ update ]</a>
            </Link>
            <p>{authUser.displayName}</p>
          </div>
          <p>
            <button>[ log out ]</button>
          </p>
          <Footer />
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});
