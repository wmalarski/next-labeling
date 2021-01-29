export enum ShortcutAction {
  FrameForward = "FrameForward",
  FrameBackward = "FrameBackward",
  DoubleFrameForward = "DoubleFrameForward",
  DoubleFrameBackward = "DoubleFrameBackward",
  SetSelectorTool = "SetSelectorTool",
  SetPanTool = "SetPanTool",
  Undo = "Undo",
  Redo = "Redo",
  SetObjectDone = "SetObjectDone",
  DeleteObject = "DeleteObject",
  DeleteForward = "DeleteForward",
  DeleteBackward = "DeleteBackward",
  CopyObject = "CopyObject",
  PasteObject = "PasteObject",
  SelectAll = "SelectAll",
  Deselect = "Deselect",
  SelectNext = "SelectNext",
  SelectPrevious = "SelectPrevious",
  MoveObjectUp = "MoveObjectUp",
  MoveObjectDown = "MoveObjectDown",
  MoveObjectLeft = "MoveObjectLeft",
  MoveObjectRight = "MoveObjectRight",
  SaveDatabase = "SaveDatabase",
}

export const shortcutCategories = [
  {
    name: "General",
    actions: [
      {
        name: "Save in database",
        action: ShortcutAction.SaveDatabase,
        default: "ctrl+shift+s",
      },
    ],
  },
  {
    name: "Frame change",
    actions: [
      {
        name: "Change 1 Frame Forward",
        action: ShortcutAction.FrameForward,
        default: "d",
      },
      {
        name: "Change 1 Frame Backward",
        action: ShortcutAction.FrameBackward,
        default: "a",
      },
      {
        name: "Change 5 Frame Forward",
        action: ShortcutAction.DoubleFrameForward,
        default: "e",
      },
      {
        name: "Change 5 Frame Backward",
        action: ShortcutAction.DoubleFrameBackward,
        default: "q",
      },
    ],
  },
  {
    name: "Tools",
    actions: [
      {
        name: "Set Selector",
        action: ShortcutAction.SetSelectorTool,
        default: "s",
      },
      {
        name: "Set Pan",
        action: ShortcutAction.SetPanTool,
        default: "p",
      },
    ],
  },
  {
    name: "Undo/Redo",
    actions: [
      {
        name: "Undo last action",
        action: ShortcutAction.Undo,
        default: "ctrl+z",
      },
      {
        name: "Redo last action",
        action: ShortcutAction.Redo,
        default: "ctrl+shift+z",
      },
    ],
  },
  {
    name: "Objects",
    actions: [
      {
        name: "Toggle Object Done",
        action: ShortcutAction.SetObjectDone,
        default: "ctrl+shift+d",
      },
      {
        name: "Delete Object",
        action: ShortcutAction.DeleteObject,
        default: "delete",
      },
      {
        name: "Delete Object Forward",
        action: ShortcutAction.DeleteForward,
        default: "alt+delete",
      },
      {
        name: "Delete Object Backward",
        action: ShortcutAction.DeleteBackward,
        default: "ctrl+delete",
      },
      {
        name: "Copy Object Frame",
        action: ShortcutAction.CopyObject,
        default: "ctrl+c",
      },
      {
        name: "Paste Object Frame",
        action: ShortcutAction.PasteObject,
        default: "ctrl+v",
      },
    ],
  },
  {
    name: "Selection",
    actions: [
      {
        name: "Select All Objects",
        action: ShortcutAction.SelectAll,
        default: "ctrl+a",
      },
      {
        name: "Deselect Objects",
        action: ShortcutAction.Deselect,
        default: "esc",
      },
      {
        name: "Select Next Object",
        action: ShortcutAction.SelectNext,
        default: "ctrl+shift+a",
      },
      {
        name: "Select Previous Object",
        action: ShortcutAction.SelectPrevious,
        default: "ctrl+shift+d",
      },
    ],
  },
  {
    name: "Object editing",
    actions: [
      {
        name: "Move Up",
        action: ShortcutAction.MoveObjectUp,
        default: "up",
      },
      {
        name: "Move Down",
        action: ShortcutAction.MoveObjectDown,
        default: "down",
      },
      {
        name: "Move Left",
        action: ShortcutAction.MoveObjectLeft,
        default: "left",
      },
      {
        name: "Move Right",
        action: ShortcutAction.MoveObjectRight,
        default: "right",
      },
    ],
  },
];

export type ShortcutActions = {
  [action in ShortcutAction]: string;
};

export const defaultShortcutActions = Object.fromEntries(
  shortcutCategories.flatMap(category =>
    category.actions.map(action => [action.action, action.default]),
  ),
) as ShortcutActions;
