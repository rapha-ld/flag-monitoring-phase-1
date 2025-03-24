
// Define types for reference line markers and threshold lines
interface ReferenceLineMarker {
  date: string;
  label: string;
  color: string;
  eventType?: 'feature' | 'bug' | 'update';
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
    color: "#8E9196", // Primary gray for fonts
    eventType: "feature"
  },
  {
    date: "2023-06-15",
    label: "Bug Fix",
    color: "#8E9196", // Primary gray for fonts
    eventType: "bug"
  },
  {
    date: "2023-06-20",
    label: "Major Update",
    color: "#8E9196", // Primary gray for fonts
    eventType: "update"
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
      position: "insideTopLeft",
      offset: 10,
      align: "left"
    }
  }
];
