import Box from "@material-ui/core/Box/Box";
import firebase from "firebase/app";
import React, { useState } from "react";

import { useAuthUserInfo } from "../../../utils/auth/hooks";
import { LabelingCollection } from "../../../utils/firestore/types";
import { ProjectDocument } from "../../../utils/projects/types";
import SearchInput from "../../common/searchInput";
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

  const [searchText, setSearchText] = useState<string | null>(null);

  const collection = firebase.firestore().collection(LabelingCollection);
  const query = (searchText
    ? collection.where("schema.name", "==", searchText)
    : collection
  ).where("project", "==", id);

  return (
    <Box>
      <SearchInput
        onSubmit={text => setSearchText(text.length ? text : null)}
      />
      {authUser && <LabelingList authUser={authUser} query={query} />}
    </Box>
  );
}
