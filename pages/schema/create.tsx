import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import firebase from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/router";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../../src/utils/auth/initFirebase";
import Header from "../../src/components/common/header";
import Footer from "../../src/components/common/footer";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import useSchemaHistory from "../../src/utils/schema/useSchemaHistory";
import Tooltip from "@material-ui/core/Tooltip";
import SchemaForm from "../../src/components/schema/schemaForm";

initFirebase();

type Inputs = {
  spaceId: string;
  title: string;
};

const initial: Inputs = {
  spaceId: "",
  title: "",
};

function SpacesCreate(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  const {
    schema,
    message,
    undoMessage,
    redoMessage,
    push: pushSchema,
    undo: undoSchema,
    redo: redoSchema,
  } = useSchemaHistory();

  var firstInput: HTMLInputElement | null = null;

  const [inputs, setInputs] = useState(initial);

  const handleSubmit = async (e: ChangeEvent<any>) => {
    e.preventDefault();
    if (!authUser) return;
    try {
      if (inputs.spaceId.length === 0) {
        throw `space ID can't be empty`;
      } else if (inputs.title.length === 0) {
        throw `title can't be empty`;
      }
      const match = inputs.spaceId.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      if (!match || match.length > 1) {
        throw `space ID can only contain letters, numbers and hyphens`;
      }
      const db = firebase.firestore();
      const ref = db.collection("spaces").doc(inputs.spaceId);
      const snap = await ref.get();
      if (snap.exists) {
        throw `a space with that ID already exists`;
      }
      await ref.set({
        spaceId: inputs.spaceId,
        title: inputs.title,
        uid: authUser.id,
      });
      router.push("/schema");
    } catch (error) {
      alert(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<any>) => {
    e.persist();
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    } else {
      firstInput?.focus();
    }
  }, []); // [] = run once

  if (!authUser) return <></>;

  const buttonDisplay = { xs: "block" };

  return (
    <div>
      <Header>
        <ButtonGroup size="small" color="inherit" variant="text">
          {undoMessage ? (
            <Tooltip title={message}>
              <Button startIcon={<UndoIcon />} onClick={undoSchema}>
                <Box display={buttonDisplay}>Undo</Box>
              </Button>
            </Tooltip>
          ) : (
            <Button startIcon={<UndoIcon />} disabled>
              <Box display={buttonDisplay}>Undo</Box>
            </Button>
          )}
          {redoMessage ? (
            <Tooltip title={redoMessage}>
              <Button startIcon={<RedoIcon />} onClick={redoSchema}>
                <Box display={buttonDisplay}>Redo</Box>
              </Button>
            </Tooltip>
          ) : (
            <Button startIcon={<RedoIcon />} disabled>
              <Box display={buttonDisplay}>Redo</Box>
            </Button>
          )}
          <Button startIcon={<SaveIcon />} onClick={() => {}}>
            <Box display={buttonDisplay}>Save</Box>
          </Button>
          <Button startIcon={<CloudUploadIcon />} onClick={() => {}}>
            <Box display={buttonDisplay}>Import</Box>
          </Button>
          <Button startIcon={<SaveAltIcon />} onClick={() => {}}>
            <Box display={buttonDisplay}>Export</Box>
          </Button>
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              router.push("/schema");
            }}
          >
            <Box display={buttonDisplay}>Remove</Box>
          </Button>
          <Button
            startIcon={<ExitToAppIcon />}
            onClick={() => router.push("/schema")}
          >
            <Box display={buttonDisplay}>Quit</Box>
          </Button>
        </ButtonGroup>
      </Header>
      <SchemaForm schema={schema} push={pushSchema} />
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="spaceId">space ID: </label>
          <input
            type="text"
            id="spaceId"
            name="spaceId"
            onChange={handleInputChange}
            value={inputs.spaceId}
            ref={(r) => (firstInput = r)}
          />
        </p>
        <p>
          <label htmlFor="title">title: </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={handleInputChange}
            value={inputs.title}
          />
        </p>
        <p>
          <button type="submit">[ create ]</button>
        </p>
      </form>
      <p>
        <Link href={"/schema"}>
          <a>[ back to schema ]</a>
        </Link>
      </p>
      <Footer />
    </div>
  );
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(SpacesCreate));
