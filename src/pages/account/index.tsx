import "firebase/auth";
import { GetServerSideProps } from "next";
import React from "react";
import withToken from "../../auth/functions/withToken";
import useAuth from "../../auth/hooks/useAuth";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import { initializeFirebase } from "../../firebase/firebaseClient";
import UserProfile from "../../user/components/userProfile";

initializeFirebase();

export default function AccountPage(): JSX.Element | null {
  const { authUser } = useAuth();

  if (!authUser) return null;

  return (
    <>
      <Header />
      <UserProfile authUser={authUser} />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});
