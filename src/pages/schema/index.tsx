import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import withToken from "../../auth/functions/withToken";
import useAuthWithRedirect from "../../auth/hooks/useAuthWithRedirect";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import SearchInput from "../../common/components/searchInput";
import { initializeFirebase } from "../../firebase/firebaseClient";
import { SchemaCollection } from "../../firebase/types";
import { SchemaList } from "../../schema/components/details/schemaList";

initializeFirebase();

export default function SchemaListPage(): JSX.Element {
  const { authUser } = useAuthWithRedirect();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string | null>(null);

  const collection = firebase.firestore().collection(SchemaCollection);
  const query = searchText
    ? collection.where("schema.name", "==", searchText)
    : collection;

  if (!authUser) return <></>;

  return (
    <>
      <Header>
        <>
          <SearchInput
            onSubmit={text => setSearchText(text.length ? text : null)}
          />
          <Button
            size="small"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => router.push("/schema/create")}
          >
            New Schema
          </Button>
        </>
      </Header>
      <Container>
        <SchemaList authUser={authUser} query={query} />
      </Container>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});
