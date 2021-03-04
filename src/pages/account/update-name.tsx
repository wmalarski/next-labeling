import "firebase/auth";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import withToken from "../../auth/functions/withToken";
import useAuth from "../../auth/hooks/useAuth";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import { initializeFirebase } from "../../firebase/firebaseClient";

initializeFirebase();

export default function AccountUpdateName(): JSX.Element {
  const { authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  return (
    <>
      <Header />
      <Link href="/account">
        <a>[ back to account ]</a>
      </Link>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});
