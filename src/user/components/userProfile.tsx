import firebase from "firebase/app";
import Link from "next/link";
import React, { useMemo } from "react";
import {
  useCollectionDataOnce,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { AuthUser } from "../../auth/types";
import { ProjectCollection, UsersCollection } from "../../firebase/types";
import { ProjectDocument } from "../../projects/types";
import { UserDocument } from "../types";

export interface UserProfileProps {
  authUser: AuthUser;
}

export default function UserProfile(
  props: UserProfileProps,
): JSX.Element | null {
  const { authUser } = props;

  const [userData] = useDocumentDataOnce<UserDocument>(
    firebase.firestore().collection(UsersCollection).doc(authUser.id),
  );

  const userDocument = useMemo<UserDocument>(
    () =>
      userData
        ? userData
        : {
            projects: [],
            email: authUser.email,
            displayName: authUser.displayName,
            uid: authUser.id,
          },
    [authUser.displayName, authUser.email, authUser.id, userData],
  );

  const [
    projectsData,
    isLoadingProjects,
  ] = useCollectionDataOnce<ProjectDocument>(
    firebase
      .firestore()
      .collection(ProjectCollection)
      .where(
        firebase.firestore.FieldPath.documentId(),
        "in",
        userDocument.projects,
      ),
  );

  console.log("UserProfile", { userDocument, projectsData, isLoadingProjects });

  return (
    <>
      <label htmlFor="displayName">display name</label>{" "}
      <Link href="/account/update-name">
        <a>[ update ]</a>
      </Link>
      <p>{authUser.displayName}</p>
      <p>{isLoadingProjects}</p>
    </>
  );
}
