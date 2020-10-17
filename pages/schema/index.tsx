import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import SearchInput from "../../components/common/searchInput";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import { SchemaList } from "../../components/schema/details/schemaList";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { SchemaCollection } from "../../utils/firestore/types";

initFirebase();

function SchemaListPage(): JSX.Element {
  const { authUser } = useAuthUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const db = firebase.firestore();
  const collection = db.collection(SchemaCollection);

  if (!authUser) return <></>;

  return (
    <>
      <Header>
        <>
          <SearchInput onSubmit={() => void 0} />
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
        <SchemaList authUser={authUser} collection={collection} />
      </Container>
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaListPage));
