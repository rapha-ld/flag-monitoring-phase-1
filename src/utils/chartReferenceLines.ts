
export const referenceLineMarkers = [
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

export const thresholdLines = [
  {
    metricType: "errorRate",
    value: 3,
    label: "Alert Threshold: 3%",
    color: "#F43F5E",
    strokeDasharray: "5 5",
    labelPosition: {
      position: "top",
      offset: -14,
      align: "right"
    }
  }
];
