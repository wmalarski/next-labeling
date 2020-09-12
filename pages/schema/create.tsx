import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import firebase from "firebase/app";
import PropTypes from "prop-types";
import { get } from "lodash";
import uniqueId from "lodash/uniqueId";
import Link from "next/link";
import Router from "next/router";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import initFirebase from "../../src/utils/auth/initFirebase";
import Header from "../../src/components/common/header";
import Footer from "../../src/components/common/footer";
import { AuthUserInfo } from "../../src/utils/auth/user";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import ObjectForm from "../../src/components/schema/objectForm";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { LabelingSchema } from "../../src/utils/schema/types";
import { FieldType } from "../../src/utils/schema/fields";

initFirebase();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: 10,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

type Inputs = {
  spaceId: string;
  title: string;
};

const initial: Inputs = {
  spaceId: "",
  title: "",
};

function SpacesCreate(): JSX.Element {
  const classes = useStyles();
  const { authUser } = useContext(AuthUserInfoContext);

  const [schema, setSchema] = useState<LabelingSchema>({
    name: "New Schema",
    description: "My first schema.",
    objects: [
      {
        id: uniqueId("object_"),
        name: "Car",
        description: "Tip: Only moving vehicles",
        fields: [
          {
            id: uniqueId("field_"),
            name: "Direction",
            perFrame: true,
            type: FieldType.COMBOBOX,
            attributes: {
              default: "Oncoming",
              options: ["Oncoming", "Preceding", "From Right", "From Left"],
            },
          },
        ],
      },
    ],
    created: new Date(),
    version: "0.0.1",
  });

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
      Router.push("/schema");
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
      Router.push("/");
    } else {
      firstInput?.focus();
    }
  }, []); // [] = run once

  if (!authUser) return <></>;

  return (
    <div>
      <Header />
      <div className={classes.root}>
        <Typography component="h1" variant="h5">
          Create new schema
        </Typography>
        <Button
          startIcon={<AddIcon />}
          color="primary"
          onClick={() =>
            setSchema({
              ...schema,
              objects: [
                ...schema.objects,
                {
                  id: uniqueId("object_"),
                  name: `Object ${schema.objects.length + 1}`,
                  description: "",
                  fields: [],
                },
              ],
            })
          }
        >
          Add new object
        </Button>
        <Button color="primary" startIcon={<UndoIcon />} onClick={() => {}}>
          Undo
        </Button>
        <Button color="primary" startIcon={<RedoIcon />} onClick={() => {}}>
          Redo
        </Button>
        <Button
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={() => {}}
        >
          Import Schema
        </Button>
        <Button color="primary" startIcon={<SaveAltIcon />} onClick={() => {}}>
          Export Schema
        </Button>
        {schema.objects.map(
          (object, index): JSX.Element => (
            <ObjectForm
              key={object.id}
              objectSchema={object}
              onChange={(object) => {
                const objects = [...schema.objects];
                objects[index] = object;
                setSchema({ ...schema, objects });
              }}
              onCopy={(object) =>
                setSchema({ ...schema, objects: [...schema.objects, object] })
              }
              onRemove={() => {
                const objects = [...schema.objects];
                objects.splice(index, 1);
                setSchema({ ...schema, objects });
              }}
              onMove={(diff) => {
                const objects = [...schema.objects];
                const newIndex = index - diff;
                if (newIndex < 0 || newIndex >= objects.length) return;
                [objects[index], objects[newIndex]] = [
                  objects[newIndex],
                  objects[index],
                ];
                setSchema({ ...schema, objects });
              }}
            />
          )
        )}
      </div>
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
