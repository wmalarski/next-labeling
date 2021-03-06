import React, { useState } from "react";
import AceEditor from "react-ace";

import { WorkflowDocument } from "../../types";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import { normalizeWorkflowRoles } from "../../functions";

export interface WorkflowTextEditorState {
  error: string | null;
  workflow: WorkflowDocument;
  isValid: boolean;
}

export interface WorkflowTextEditorProps {
  workflow: WorkflowDocument;
  push: (provider: (workflow: WorkflowDocument) => WorkflowDocument) => void;
}

export default function WorkflowTextEditor(
  props: WorkflowTextEditorProps,
): JSX.Element {
  const { workflow } = props;
  const [, setNewWorkflow] = useState<WorkflowTextEditorState>({
    error: null,
    isValid: true,
    workflow,
  });

  return (
    <AceEditor
      mode="json"
      theme="github"
      width="100%"
      value={JSON.stringify(workflow, null, 2)}
      showGutter={true}
      onChange={newValue => {
        try {
          const result = JSON.parse(newValue);
          setNewWorkflow({
            workflow: normalizeWorkflowRoles(WorkflowDocument.encode(result)),
            isValid: true,
            error: null,
          });
        } catch (err) {
          console.log({ err });
        }
      }}
      name="UNIQUE_ID_OF_DIV"
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={{ $blockScrolling: true }}
    />
  );
}
