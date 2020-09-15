import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../../src/utils/auth/initFirebase";
import Header from "../../src/components/common/header";
import Footer from "../../src/components/common/footer";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import useSchemaHistory from "../../src/utils/schema/useSchemaHistory";
import Tooltip from "@material-ui/core/Tooltip";
import SchemaForm from "../../src/components/schema/forms/schemaForm";
import { saveSchema } from "../../src/utils/schema/firebaseUtils";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

initFirebase();

function SpacesCreate(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  const {
    schema,
    message,
    undoMessage,
    redoMessage,
    setSchema,
    undoSchema,
    redoSchema,
  } = useSchemaHistory();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, []); // [] = run once

  const [isOpenSaveSnackbar, setIsOpenSaveSnackbar] = useState(false);

  if (!authUser) return <></>;

  return (
    <>
      <Header>
        <ButtonGroup size="small" color="inherit" variant="text">
          {undoMessage ? (
            <Tooltip title={message}>
              <Button startIcon={<UndoIcon />} onClick={undoSchema}>
                Undo
              </Button>
            </Tooltip>
          ) : (
            <Button startIcon={<UndoIcon />} disabled>
              Undo
            </Button>
          )}
          {redoMessage ? (
            <Tooltip title={redoMessage}>
              <Button startIcon={<RedoIcon />} onClick={redoSchema}>
                Redo
              </Button>
            </Tooltip>
          ) : (
            <Button startIcon={<RedoIcon />} disabled>
              Redo
            </Button>
          )}
          <Button
            startIcon={<SaveIcon />}
            onClick={async () => {
              const { errors } = await saveSchema(schema, authUser);
              setIsOpenSaveSnackbar(true);
              if (errors.length !== 0) {
                alert(errors);
              }
            }}
          >
            Save
          </Button>
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              router.push("/schema");
            }}
          >
            Remove
          </Button>
          <Button
            startIcon={<ExitToAppIcon />}
            onClick={() => router.push("/schema")}
          >
            Quit
          </Button>
        </ButtonGroup>
      </Header>
      <SchemaForm schema={schema} setSchema={setSchema} />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isOpenSaveSnackbar}
        autoHideDuration={6000}
        onClose={() => setIsOpenSaveSnackbar(false)}
        message="Schema saved"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setIsOpenSaveSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Footer />
    </>
  );
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(SpacesCreate));
