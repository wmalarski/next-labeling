import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem/TreeItem";
import Konva from "konva";
import React, { useContext } from "react";
import { Rect } from "react-konva";

import FramesContext from "../../contexts/frames/framesContext";
import { calculateFieldBlocks } from "../../utils/labeling/functions";
import { ExtendedField, ExtendedObject } from "../../utils/labeling/types";

class ColoredRect extends React.Component {
  state = {
    color: "green",
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor(),
    });
  };
  render() {
    return (
      <Rect
        x={0}
        y={20}
        width={600}
        height={50}
        fill={this.state.color}
        onClick={this.handleClick}
      />
    );
  }
}

export interface TimelineFieldItemProps extends TreeItemProps {
  field: ExtendedField;
  object: ExtendedObject;
}

export function TimelineFieldItem(props: TimelineFieldItemProps): JSX.Element {
  const { field, object, ...other } = props;
  const { fieldSchema } = field;
  const { frames, objectSchema } = object;
  const { duration } = useContext(FramesContext);

  // const blocks = calculateFieldBlocks(
  //   field,
  //   fieldSchema,
  //   duration,
  //   frames ??,
  //   objectSchema.singleton,
  // );

  return (
    <TreeItem
      label={
        // <ReactResizeDetector handleWidth>
        //   {({ width }: { width: number }) => (
        //     <div>
        //       <Typography variant="body2">{fieldSchema.name}</Typography>
        //       {/* <pre>{JSON.stringify({ ...props, blocks: blocks }, null, 2)}</pre> */}
        //       <Stage width={width} height={100}>
        //         <Layer>
        //           <Text text="Try click on rect" />
        //           <ColoredRect />
        //         </Layer>
        //       </Stage>
        //     </div>
        //   )}
        // </ReactResizeDetector>
        <p>{fieldSchema.name}</p>
      }
      {...other}
    />
  );
}
