import { GetServerSideProps } from "next";
import React from "react";
import withToken from "../auth/functions/withToken";
import useAuth from "../auth/hooks/useAuth";
import Footer from "../common/components/footer";
import Header from "../common/components/header";
import { initializeFirebase } from "../firebase/firebaseClient";

initializeFirebase();

export default function Index(): JSX.Element {
  const { authUser } = useAuth();
  return (
    <>
      <Header />
      <pre>{JSON.stringify(authUser, null, 2)}</pre>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken();
