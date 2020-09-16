import "firebase/firestore";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import SchemaListItem from "../../src/components/schema/details/schemaListItem";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import ResultSnackbar, {
  ResultSnackbarState,
} from "../../src/components/common/resultSnackbar";
import useRemoveSchema from "../../src/utils/schema/useRemoveSchema";
import useCreateSchema from "../../src/utils/schema/useCreateSchema";

initFirebase();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }),
);

function SchemaList(): JSX.Element {
  const classes = useStyles();
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const db = firebase.firestore();

  const { loading, loadingMore, hasMore, items, loadMore } = usePagination(
    db.collection("spaces").orderBy("created", "asc"),
    {
      limit: 10,
    },
  );

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const { create: createSchema, state: createSchemaState } = useCreateSchema();
  useEffect(() => {
    if (createSchemaState.document) {
      router.push("/schema/[id]", `/schema/${createSchemaState.document.id}`);
    } else if (createSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${createSchemaState.errors}`,
      });
    }
  }, [createSchemaState.document, createSchemaState.errors, router]);

  const { remove: removeSchema, state: removeSchemaState } = useRemoveSchema();
  useEffect(() => {
    if (removeSchemaState.success) {
      setSnackbarState({ isOpen: true, message: "Schema removed" });
    } else if (removeSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${removeSchemaState.errors}`,
      });
    }
  }, [removeSchemaState.errors, removeSchemaState.success, router]);

  if (!authUser) return <></>;

  return (
    <>
      <Header>
        <>
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
        </>
      </Header>
      <Container>
        {loading && <div>...</div>}
        {items.map(doc => {
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
        )}
      </Container>
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaList));
