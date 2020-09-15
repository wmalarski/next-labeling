import React, { useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../../src/utils/auth/initFirebase";
import usePagination from "firestore-pagination-hook";
import Header from "../../src/components/common/header";
import Footer from "../../src/components/common/footer";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import SearchIcon from "@material-ui/icons/Search";
import SchemaListItem from "../../src/components/schema/details/schemaListItem";
import InputBase from "@material-ui/core/InputBase";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

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

function Spaces(): JSX.Element {
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
    db
      .collection("spaces")
      // .where("uid", "==", authUser?.id || "")
      .orderBy("created", "asc"),
    {
      limit: 10,
    },
  );
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
      <div>
        {loading && <div>...</div>}
        {items.map(document => (
          <SchemaListItem
            key={document.id}
            document={{ ...document.data(), id: document.id }}
          />
        ))}
        {hasMore && !loadingMore && (
          <button onClick={loadMore}>[ more ]</button>
        )}
      </div>
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(Spaces));
