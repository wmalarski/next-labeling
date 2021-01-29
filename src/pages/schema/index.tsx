import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import initFirebase from "../../auth/initFirebase";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import SearchInput from "../../common/components/searchInput";
import withAuthUser from "../../common/wrappers/withAuthUser";
import withAuthUserInfo from "../../common/wrappers/withAuthUserInfo";
import { SchemaCollection } from "../../firestore/types";
import { SchemaList } from "../../schema/components/details/schemaList";

initFirebase();

function SchemaListPage(): JSX.Element {
  const { authUser } = useAuthUserInfo();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

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

export default withAuthUser(withAuthUserInfo(SchemaListPage));
