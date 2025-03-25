
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { MessageSquareText } from 'lucide-react';

interface Feedback {
  id: string;
  email: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
}

interface FeedbackSummaryProps {
  feedbackData: Feedback[];
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ feedbackData }) => {
  const sentimentCounts = feedbackData.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalFeedback = feedbackData.length;
  const positivePercentage = Math.round((sentimentCounts.positive || 0) / totalFeedback * 100);
  const neutralPercentage = Math.round((sentimentCounts.neutral || 0) / totalFeedback * 100);
  const negativePercentage = Math.round((sentimentCounts.negative || 0) / totalFeedback * 100);

  const commonPositiveThemes = "Checkout speed, mobile experience, new design, payment options";
  const commonNegativeThemes = "Payment errors, loading times, process complexity";
  const suggestions = "Consider optimizing payment processing, improving mobile performance, and simplifying the checkout flow";

  return (
    <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareText className="h-5 w-5 text-indigo-500" />
        <h3 className="text-md font-medium">Feedback Summary</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-3">
        <div>
          <h4 className="text-sm font-medium mb-1">Sentiment Distribution</h4>
          <div className="text-sm space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Positive</span>
                <span>{positivePercentage}% ({sentimentCounts.positive || 0})</span>
              </div>
              <Progress value={positivePercentage} className="h-2 bg-gray-200" 
                color="rgb(34, 197, 94)"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Neutral</span>
                <span>{neutralPercentage}% ({sentimentCounts.neutral || 0})</span>
              </div>
              <Progress value={neutralPercentage} className="h-2 bg-gray-200" 
                color="rgb(245, 158, 11)"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Negative</span>
                <span>{negativePercentage}% ({sentimentCounts.negative || 0})</span>
              </div>
              <Progress value={negativePercentage} className="h-2 bg-gray-200" 
                color="rgb(239, 68, 68)"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Common Themes</h4>
          <div className="text-sm">
            <div className="mb-1">
              <span className="font-medium text-green-600">Positive: </span>
              {commonPositiveThemes}
            </div>
            <div>
              <span className="font-medium text-red-600">Negative: </span>
              {commonNegativeThemes}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Recommendations</h4>
          <div className="text-sm">{suggestions}</div>
        </div>
      </div>
      
      <div className="text-xs text-slate-500">
        Based on {totalFeedback} user feedback entries collected over the past {Math.ceil(totalFeedback / 2)} days.
      </div>
    </div>
  );
};

export default FeedbackSummary;
