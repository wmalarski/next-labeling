import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import SearchInput from "../../components/common/searchInput";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import ProjectListItem from "../../components/projects/details/projectListItem";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { ProjectCollection } from "../../utils/firestore/types";
import useFetchDocuments from "../../utils/firestore/useFetchDocuments";
import { ProjectDocument } from "../../utils/projects/types";

initFirebase();

function ProjectListPage(): JSX.Element {
  const { authUser } = useAuthUserInfo();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const collection = firebase.firestore().collection(ProjectCollection);
  const query = searchText
    ? collection.where("name", "==", searchText)
    : collection;

  const { loading, hasMore, items, loadMore } = useFetchDocuments({
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
          {hasMore && <button onClick={loadMore}>[ more ]</button>}
        </List>
      </Container>
      <LoadingBackdrop isLoading={loading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(ProjectListPage));
