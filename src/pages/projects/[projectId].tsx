import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import CodeIcon from "@material-ui/icons/Code";
import CropFreeIcon from "@material-ui/icons/CropFree";
import GroupIcon from "@material-ui/icons/Group";
import SettingsIcon from "@material-ui/icons/Settings";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import withToken from "../../auth/functions/withToken";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import TabPanel from "../../common/components/tabPanel";
import ProjectGeneralDetails from "../../projects/components/details/projectGeneralDetails";
import ProjectLabelingDetails from "../../projects/components/details/projectLabelingDetails";
import ProjectSettingsDetails from "../../projects/components/details/projectSettingsDetails";
import ProjectSmallDetails from "../../projects/components/details/projectSmallDetails";
import ProjectUsersDetails from "../../projects/components/details/projectUsersDetails";
import ProjectWorkflowDetails from "../../projects/components/details/projectWorkflowDetails";
import useFetchProject from "../../projects/hooks/useFetchProject";
import { useProjectDetailsPageStyles } from "../../projects/styles";

enum ProjectDetailsPages {
  General,
  Labeling,
  Workflow,
  Users,
  Settings,
}

export interface ProjectDetailsPageProps {
  documentId: string;
}

export default function ProjectDetailsPage(
  props: ProjectDetailsPageProps,
): JSX.Element {
  const { documentId } = props;

  const classes = useProjectDetailsPageStyles();

  const router = useRouter();

  const { isLoading, exist, document } = useFetchProject(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  const [tabsIndex, setTabsIndex] = useState<ProjectDetailsPages>(
    ProjectDetailsPages.Labeling,
  );

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

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
  getter: async ({ params }) => {
    const documentId = Array.isArray(params?.projectId)
      ? undefined
      : params?.projectId;

    if (!documentId) return { notFound: true };

    return { props: { documentId } };
  },
});
