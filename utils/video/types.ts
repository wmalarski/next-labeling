export interface FieldVisualizationCustoms {
  texts?: {
    fieldSchemaId: string;
    position: string;
    fontSize: number;
    fontStyle: string;
  }[];
  dash?: number[];
  opacity?: number;
  radius?: number;
  selectedStroke?: number;
  unselectedStroke?: number;
}

export type FieldVisualization = {
  [schemaId: string]: FieldVisualizationCustoms[];
};
