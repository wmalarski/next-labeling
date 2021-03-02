import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import EditIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import { LabelingAction } from "../workspace/types/client";

const actionIcons: Record<
  LabelingAction,
  OverridableComponent<SvgIconTypeMap<unknown, "svg">>
> = {
  [LabelingAction.ADD_OBJECT_COPY]: FileCopyIcon,
  [LabelingAction.SET_ATTRIBUTE]: EditIcon,
  [LabelingAction.ADD_OBJECT]: AddBoxIcon,
  [LabelingAction.SET_SNAPSHOT]: AddAPhotoIcon,
  [LabelingAction.SELECTION_CHANGE]: SelectAllIcon,
  [LabelingAction.DELETE_BACKWARD]: ArrowBackIcon,
  [LabelingAction.DELETE_FORWARD]: ArrowForwardIcon,
  [LabelingAction.DELETE_OBJECTS]: HighlightOffIcon,
  [LabelingAction.SET_IS_DONE]: CheckCircleIcon,
  [LabelingAction.SET_IS_TRACKED]: ImageSearchIcon,
  [LabelingAction.SET_NAME]: EditIcon,
};

export default actionIcons;
