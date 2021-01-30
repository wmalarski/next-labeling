import Box from "@material-ui/core/Box/Box";
import firebase from "firebase/app";
import React, { useState } from "react";
import useAuth from "../../../auth/hooks/useAuth";
import SearchInput from "../../../common/components/searchInput";
import { LabelingCollection } from "../../../firebase/types";
import LabelingList from "../../../labeling/components/labelingList";
import { ProjectDocument } from "../../types";

export interface ProjectLabelingDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectLabelingDetails(
  props: ProjectLabelingDetailsProps,
): JSX.Element {
  const { id } = props;
  const { authUser } = useAuth();

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
