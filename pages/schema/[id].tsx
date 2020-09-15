import "firebase/firestore";

import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import firebase from "firebase/app";
import { PathReporter } from "io-ts/PathReporter";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import SchemaDetails from "../../src/components/schema/details/schemaDetails";
import RawForm from "../../src/components/schema/forms/rawForm";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import {
  SchemaDocument,
  SchemaDocumentType,
} from "../../src/utils/schema/types";

initFirebase();

interface SchemaDetailsState {
  schemaDocument?: SchemaDocument;
  errors?: string[];
}

function SchemaDetailsPage(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);

  const router = useRouter();
  const { id: documentId } = router.query;

  const [state, setState] = useState<SchemaDetailsState>({});

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  useEffect(() => {
    if (!Array.isArray(documentId)) {
      const db = firebase.firestore();
      db.collection("spaces")
        .doc(documentId)
        .get()
        .then(doc => {
          const data = doc.data();
          if (!doc.exists || !data) {
            router.push("/404");
            return;
          }
          console.log("data", data);
          const decoded = SchemaDocumentType.decode(data);
          const errors =
            decoded._tag === "Left" ? PathReporter.report(decoded) : [];
          setState({
            errors,
            schemaDocument: SchemaDocumentType.encode(data as SchemaDocument),
          });
        });
    }
  }, []);

  if (!authUser) return <></>;
  const isSameUser = authUser.id === state.schemaDocument?.user.id;

  return (
    <>
      <Header>
        {state.schemaDocument ? (
          <>
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<EditIcon />}
                // onClick={() => {}}
              >
                Edit
              </Button>
            ) : (
              <></>
            )}
            <RawForm
              startIcon={<SaveAltIcon />}
              label="Export"
              schema={state.schemaDocument.schema}
            />
            <Button
              size="small"
              color="inherit"
              startIcon={<FileCopyIcon />}
              // onClick={() => {}}
            >
              Copy
            </Button>
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<DeleteOutlineIcon />}
                // onClick={() => {}}
              >
                Remove
              </Button>
            ) : (
              <></>
            )}
            <Button
              size="small"
              color="inherit"
              startIcon={<ExitToAppIcon />}
              onClick={() => router.push("/schema")}
            >
              Return
            </Button>
          </>
        ) : (
          <></>
        )}
      </Header>
      {state.schemaDocument ? (
        <SchemaDetails schemaDocument={state.schemaDocument} />
      ) : (
        <></>
      )}
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaDetailsPage));
