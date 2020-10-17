import Box from "@material-ui/core/Box/Box";
import firebase from "firebase/app";
import React from "react";

import { useAuthUserInfo } from "../../../utils/auth/hooks";
import { LabelingCollection } from "../../../utils/firestore/types";
import { ProjectDocument } from "../../../utils/projects/types";
import LabelingList from "../../labeling/labelingList";

export interface ProjectLabelingDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectLabelingDetails(
  props: ProjectLabelingDetailsProps,
): JSX.Element {
  const { id } = props;
  const { authUser } = useAuthUserInfo();

  const db = firebase.firestore();
  const collection = db.collection(LabelingCollection);
  const query = collection.where("project", "==", id);

  return (
    <Box>
      {authUser && (
        <LabelingList
          authUser={authUser}
          collection={collection}
          query={query}
        />
      )}
    </Box>
  );
}
