
// Define types for reference line markers and threshold lines
interface ReferenceLineMarker {
  date: string;
  label: string;
  color: string;
}

interface LabelPosition {
  position: string;
  offset: number;
  align: string;
}

interface ThresholdLine {
  metricType: string;
  value: number;
  label: string;
  color: string;
  strokeDasharray: string;
  labelPosition: LabelPosition;
}

export const referenceLineMarkers: ReferenceLineMarker[] = [
  {
    date: "2023-06-10",
    label: "Feature Release",
    color: "#6366F1"
  },
  {
    date: "2023-06-15",
    label: "Bug Fix",
    color: "#10B981"
  },
  {
    date: "2023-06-20",
    label: "Major Update",
    color: "#F43F5E"
  }
];

export const thresholdLines: ThresholdLine[] = [
  {
    metricType: "errorRate",
    value: 3,
    label: "Alert Threshold: 3%",
    color: "#F43F5E",
    strokeDasharray: "5 5",
    labelPosition: {
      position: "top",
      offset: -10,
      align: "left"
    }
  }
];
