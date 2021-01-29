import { render } from "@testing-library/react";
import React from "react";
import ActionListItem from "../../src/comments/components/actionListItem";
import { CommentDocument } from "../../src/comments/types";

function renderActionListItem(comment: Partial<CommentDocument> = {}) {
  const defaultComment: CommentDocument = {
    parentId: null,
    createdAt: null,
    user: {
      displayName: "displayName",
      email: "displayName@example.com",
      emailVerified: true,
      id: "displayName",
    },
    isThread: true,
    isResolved: true,
    isEdited: true,
    isAction: true,
    message: "message",
    snapshot: null,
    reactions: [],
  };
  return render(<ActionListItem comment={{ ...defaultComment, ...comment }} />);
}

describe("<ActionListItem />", () => {
  test("should display a action list item with display name, message and date", async () => {
    const { findByText } = renderActionListItem();
    const textComponent = await findByText("displayName");
    expect(textComponent).toBeTruthy();
  });
});
