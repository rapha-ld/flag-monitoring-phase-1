
export interface ChartAnnotation {
  timestamp: string;
  label: string;
  description: string;
  color?: string;
}

export const evaluationAnnotations: ChartAnnotation[] = [
  {
    timestamp: "2023-06-10T12:00:00",
    label: "Changed targeting rules",
    description: "Updated targeting rules to include new user segments based on geographic location.",
    color: "#6366F1"
  },
  {
    timestamp: "2023-06-15T14:30:00",
    label: "Applied approved changes",
    description: "Implemented changes approved in QA to resolve inconsistent evaluation results.",
    color: "#10B981"
  },
  {
    timestamp: "2023-06-20T09:45:00",
    label: "Changed default variation",
    description: "Modified the default variation to improve baseline performance metrics.",
    color: "#F43F5E"
  }
];
