import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import withToken from "../../auth/functions/withToken";
import useAuthWithRedirect from "../../auth/hooks/useAuthWithRedirect";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import SearchInput from "../../common/components/searchInput";
import { initializeFirebase } from "../../firebase/firebaseClient";
import useFetchDocuments from "../../firebase/hooks/useFetchDocuments";
import { ProjectCollection } from "../../firebase/types";
import ProjectListItem from "../../projects/components/details/projectListItem";
import { ProjectDocument } from "../../projects/types";

initializeFirebase();

export default function ProjectListPage(): JSX.Element {
  const { authUser } = useAuthWithRedirect();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string | null>(null);

  const collection = firebase.firestore().collection(ProjectCollection);
  const query = searchText
    ? collection.where("name", "==", searchText)
    : collection;

  const { loading, items, fetchMore: fetchNext } = useFetchDocuments({
    query,
    type: ProjectDocument,
    options: { limit: 10 },
  });

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
            onClick={() => router.push("/projects/create")}
          >
            New Project
          </Button>
        </>
      </Header>
      <Container>
        <List>
          {items.map(pair => (
            <ProjectListItem
              key={pair.id}
              id={pair.id}
              project={pair.document}
            />
          ))}
          <button onClick={fetchNext}>[ next ]</button>
        </List>
      </Container>
      <LoadingBackdrop isLoading={loading} />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});
