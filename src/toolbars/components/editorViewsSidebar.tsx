import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ChatIcon from "@material-ui/icons/Chat";
import ViewListIcon from "@material-ui/icons/ViewList";
import React from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { labelingViewsSelector } from "../../preferences/redux/selectors";
import { toggleWorkspaceView } from "../../workspace/redux/slice";
import { isViewVisible, LabelingView } from "../../workspace/views";

function EditorViewsSidebar(): JSX.Element {
  const dispatch = useRootDispatch();
  const views = useSelector(labelingViewsSelector);

  return (
    <List>
      <ListItem
        button
        selected={isViewVisible(views, LabelingView.TIMELINE)}
        onClick={() => dispatch(toggleWorkspaceView(LabelingView.TIMELINE))}
      >
        <ListItemIcon>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary={"Timeline"} />
      </ListItem>
      <ListItem
        button
        selected={isViewVisible(views, LabelingView.PROPERTIES)}
        onClick={() => dispatch(toggleWorkspaceView(LabelingView.PROPERTIES))}
      >
        <ListItemIcon>
          <ViewListIcon />
        </ListItemIcon>
        <ListItemText primary={"Properties"} />
      </ListItem>
      <ListItem
        button
        selected={isViewVisible(views, LabelingView.COMMENTS)}
        onClick={() => dispatch(toggleWorkspaceView(LabelingView.COMMENTS))}
      >
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary={"Comments"} />
      </ListItem>
    </List>
  );
}

export default React.memo(EditorViewsSidebar);
