import "firebase/firestore";

import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar, {
  ResultSnackbarState,
} from "../../src/components/common/resultSnackbar";
import { useSearchBarStyle } from "../../src/themes/styles";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";

initFirebase();

function SchemaList(): JSX.Element {
  const classes = useSearchBarStyle();
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  // const db = firebase.firestore();

  // const { loading, loadingMore, hasMore, items, loadMore } = usePagination(
  //   db.collection("files").orderBy("created", "asc"),
  //   {
  //     limit: 10,
  //   },
  // );

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  // const { create: createSchema, state: createSchemaState } = useCreateSchema();
  // useEffect(() => {
  //   if (createSchemaState.document) {
  //     router.push("/schema/[id]", `/schema/${createSchemaState.document.id}`);
  //   } else if (createSchemaState.errors) {
  //     setSnackbarState({
  //       isOpen: true,
  //       message: `${createSchemaState.errors}`,
  //     });
  //   }
  // }, [createSchemaState.document, createSchemaState.errors, router]);

  // const { remove: removeSchema, state: removeSchemaState } = useRemoveSchema();
  // useEffect(() => {
  //   if (removeSchemaState.success) {
  //     setSnackbarState({ isOpen: true, message: "Schema removed" });
  //   } else if (removeSchemaState.errors) {
  //     setSnackbarState({
  //       isOpen: true,
  //       message: `${removeSchemaState.errors}`,
  //     });
  //   }
  // }, [removeSchemaState.errors, removeSchemaState.success, router]);

  if (!authUser) return <></>;

  const loading = false;

  return (
    <>
      <Header>
        {/* <>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onEnded={event => {
                console.log("event", event);
              }}
            />
          </div>
          <Button
            size="small"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => router.push("/schema/create")}
          >
            New Schema
          </Button>
        </> */}
      </Header>
      <Container>
        {/* {items.map(doc => {
          const document = doc.data();
          return (
            <SchemaListItem
              key={doc.id}
              document={{ ...document, id: doc.id }}
              onCopyClicked={() =>
                createSchema({
                  ...document,
                  user: authUser,
                  stars: 0,
                  created: new Date().toJSON(),
                })
              }
              onRemoveClicked={() => removeSchema(doc.id)}
            />
          );
        })}
        {hasMore && !loadingMore && (
          <button onClick={loadMore}>[ more ]</button>
        )} */}
      </Container>
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop isLoading={loading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaList));
