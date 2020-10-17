import "firebase/firestore";

import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import CropFreeIcon from "@material-ui/icons/CropFree";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TuneIcon from "@material-ui/icons/Tune";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import TabPanel from "../../components/common/tabPanel";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import ProjectLabelingDetails from "../../components/projects/details/projectLabelingDetails";
import ProjectSmallDetails from "../../components/projects/details/projectSmallDetails";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import useFetchProject from "../../utils/projects/hooks/useFetchProject";
import ProjectSchemasDetails from "../../components/projects/details/projectSchemasDetails";
import ProjectStatisticsDetails from "../../components/projects/details/projectStatisticsDetails";
import ProjectUsersDetails from "../../components/projects/details/projectUsersDetails";
import ProjectWorkflowDetails from "../../components/projects/details/projectWorkflowDetails";
import ProjectSettingsDetails from "../../components/projects/details/projectSettingsDetails";

initFirebase();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      padding: theme.spacing(3),
    },
  }),
);

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

  const [tabsIndex, setTabsIndex] = useState<number>(0);

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
              <Tab icon={<CropFreeIcon />} label="Labeling" />
              <Tab icon={<TrendingUpIcon />} label="Workflow" />
              <Tab icon={<GroupIcon />} label="Users" />
              <Tab icon={<EqualizerIcon />} label="Statistics" />
              <Tab icon={<TuneIcon />} label="Schemas" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
          </Paper>
          <TabPanel index={0} value={tabsIndex}>
            <ProjectLabelingDetails id={documentId} project={document} />
          </TabPanel>
          <TabPanel index={1} value={tabsIndex}>
            <ProjectWorkflowDetails id={documentId} project={document} />
            <Typography variant="body2">Workflow</Typography>
          </TabPanel>
          <TabPanel index={2} value={tabsIndex}>
            <ProjectUsersDetails id={documentId} project={document} />
            <Typography variant="body2">Users</Typography>
          </TabPanel>
          <TabPanel index={3} value={tabsIndex}>
            <ProjectStatisticsDetails id={documentId} project={document} />
            <Typography variant="body2">Statistics</Typography>
          </TabPanel>
          <TabPanel index={4} value={tabsIndex}>
            <ProjectSchemasDetails id={documentId} project={document} />
            <Typography variant="body2">Schemas</Typography>
          </TabPanel>
          <TabPanel index={5} value={tabsIndex}>
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
