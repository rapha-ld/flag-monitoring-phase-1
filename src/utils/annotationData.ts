
import { AnnotationData } from '@/components/chart/ChartAnnotation';

// Sample annotation data for the Evaluations chart
export const evaluationAnnotations: AnnotationData[] = [
  {
    date: "2023-04-15",
    position: 10,
    type: "targeting",
    details: "Updated targeting rules to include new user segments based on geographic location."
  },
  {
    date: "2023-05-05",
    position: 30,
    type: "approved",
    details: "Applied approved changes from QA testing phase to production."
  },
  {
    date: "2023-05-25",
    position: 55,
    type: "variation",
    details: "Changed default variation from Variant A to Variant B to optimize for higher conversion rate."
  }
];

// Function to process annotations to match filtered data positions
export const processAnnotations = (
  annotations: AnnotationData[],
  originalData: Array<{name: string}>,
  filteredData: Array<{name: string}>
): AnnotationData[] => {
  return annotations
    .map(annotation => {
      // Find the date of the original annotation
      const originalDate = originalData[annotation.position]?.name;
      // Find the new position in filtered data
      const newPosition = filteredData.findIndex(item => item.name === originalDate);
      return {
        ...annotation,
        position: newPosition >= 0 ? newPosition : -1 // Use -1 to indicate out of range
      };
    })
    .filter(annotation => annotation.position >= 0); // Only include annotations that are in range
};
