import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useFieldDetailsStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
  }),
);

export const useSchemaDetailsStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    grid: {
      marginTop: theme.spacing(1),
    },
  }),
);

export const useSchemaListItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    grid: {
      marginTop: theme.spacing(1),
    },
  }),
);

export const useComboBoxFormStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
  }),
);

export const useFieldFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
    },
    column: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

export const useMulSelectFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
      padding: theme.spacing(1),
    },
  }),
);

export const useObjectFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    column: {
      flexBasis: "33.33%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);

export const useSchemaFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
  }),
);

export const useSelectFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
      padding: theme.spacing(1),
    },
  }),
);
