import "firebase/firestore";

import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import CodeIcon from "@material-ui/icons/Code";
import CropFreeIcon from "@material-ui/icons/CropFree";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import TabPanel from "../../components/common/tabPanel";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import ProjectGeneralDetails from "../../components/projects/details/projectGeneralDetails";
import ProjectLabelingDetails from "../../components/projects/details/projectLabelingDetails";
import ProjectSettingsDetails from "../../components/projects/details/projectSettingsDetails";
import ProjectSmallDetails from "../../components/projects/details/projectSmallDetails";
import ProjectUsersDetails from "../../components/projects/details/projectUsersDetails";
import ProjectWorkflowDetails from "../../components/projects/details/projectWorkflowDetails";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import useFetchProject from "../../utils/projects/hooks/useFetchProject";

initFirebase();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      padding: theme.spacing(3),
    },
  }),
);

enum ProjectDetailsPages {
  General,
  Labeling,
  Workflow,
  Users,
  Settings,
}

function ProjectDetailsPage(): JSX.Element {
  const classes = useStyles();
  const { authUser } = useAuthUserInfo();

  const router = useRouter();
  const { projectId: queryDocumentId } = router.query;
  const documentId = !Array.isArray(queryDocumentId)
    ? queryDocumentId
    : queryDocumentId[0];

  useEffect(() => {
    if (authUser) return;
    router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoading, exist, document } = useFetchProject(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  const [tabsIndex, setTabsIndex] = useState<ProjectDetailsPages>(
    ProjectDetailsPages.Labeling,
  );

  if (!authUser) return <></>;

  return (
    <>
      <Header />
      {document && (
        <>
          <Paper>
            <div className={classes.paper}>
              <ProjectSmallDetails id={documentId} project={document} />
            </div>
            <Tabs
              value={tabsIndex}
              onChange={(_event, newValue) => setTabsIndex(newValue)}
              aria-label="simple tabs example"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<CodeIcon />} label="General" />
              <Tab icon={<CropFreeIcon />} label="Labeling" />
              <Tab icon={<TrendingUpIcon />} label="Workflow" />
              <Tab icon={<GroupIcon />} label="Users" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
          </Paper>
          <TabPanel index={ProjectDetailsPages.General} value={tabsIndex}>
            <ProjectGeneralDetails id={documentId} project={document} />
          </TabPanel>
          <TabPanel index={ProjectDetailsPages.Labeling} value={tabsIndex}>
            <ProjectLabelingDetails id={documentId} project={document} />
          </TabPanel>
          <TabPanel index={ProjectDetailsPages.Workflow} value={tabsIndex}>
            <ProjectWorkflowDetails id={documentId} project={document} />
            <Typography variant="body2">Workflow</Typography>
          </TabPanel>
          <TabPanel index={ProjectDetailsPages.Users} value={tabsIndex}>
            <ProjectUsersDetails id={documentId} project={document} />
            <Typography variant="body2">Users</Typography>
          </TabPanel>
          <TabPanel index={ProjectDetailsPages.Settings} value={tabsIndex}>
            <ProjectSettingsDetails id={documentId} project={document} />
            <Typography variant="body2">Settings</Typography>
          </TabPanel>
        </>
      )}
      <LoadingBackdrop isLoading={isLoading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(ProjectDetailsPage));
