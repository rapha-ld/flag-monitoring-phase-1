
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MessageSquareText } from 'lucide-react';

// Define the interface for feedback data
interface Feedback {
  id: string;
  email: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
}

// Sample data for the feedback table
const feedbackData: Feedback[] = [
  {
    id: '1',
    email: 'satisfied.user@example.com',
    feedback: 'The new checkout flow is much faster and more intuitive. I love the simplicity!',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    id: '2',
    email: 'regular.customer@example.com',
    feedback: 'The checkout works fine but I had to try twice to complete my order.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '3',
    email: 'unhappy.shopper@example.com',
    feedback: 'I encountered an error during payment and had to start over. Very frustrating experience.',
    sentiment: 'negative',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '4',
    email: 'new.user@example.com',
    feedback: 'As a first-time user, I found the checkout process straightforward, but the loading times could be improved.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: '5',
    email: 'happy.client@example.com',
    feedback: 'The update to the checkout flow has made my shopping experience so much better. Thank you!',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: '6',
    email: 'frustrated.user@example.com',
    feedback: 'I keep getting timeout errors during the payment process. Fix this ASAP!',
    sentiment: 'negative',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '7',
    email: 'loyal.customer@example.com',
    feedback: 'I love the new design, but noticed some images don\'t load correctly on mobile.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    id: '8',
    email: 'tech.savvy@example.com',
    feedback: 'The integration with Apple Pay is seamless. Great job on adding this feature!',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  },
  {
    id: '9',
    email: 'mobile.user@example.com',
    feedback: 'The mobile experience is significantly improved. I can finally checkout without switching to desktop.',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
  },
  {
    id: '10',
    email: 'security.conscious@example.com',
    feedback: 'I appreciate the enhanced security features, but the verification step adds too much friction.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
  },
  {
    id: '11',
    email: 'impatient.shopper@example.com',
    feedback: 'Too many steps in the checkout process. I abandoned my cart because it took too long.',
    sentiment: 'negative',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    id: '12',
    email: 'accessibility.advocate@example.com',
    feedback: 'The improved screen reader compatibility is fantastic. Thank you for making your site more accessible!',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) // 11 days ago
  },
  {
    id: '13',
    email: 'international.buyer@example.com',
    feedback: 'Currency conversion works well, but I would like to see prices in my local currency by default.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
  },
  {
    id: '14',
    email: 'returning.customer@example.com',
    feedback: 'The saved payment methods feature is a game-changer for repeat purchases.',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) // 13 days ago
  },
  {
    id: '15',
    email: 'discount.hunter@example.com',
    feedback: 'Love the new promo code system, but sometimes valid codes are marked as expired.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  },
  {
    id: '16',
    email: 'first.time.buyer@example.com',
    feedback: 'As a new customer, I found your checkout process incredibly easy to navigate.',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
  },
  {
    id: '17',
    email: 'gift.purchaser@example.com',
    feedback: 'The gift wrapping option is hard to find. Please make it more visible during checkout.',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000) // 16 days ago
  },
  {
    id: '18',
    email: 'privacy.concerned@example.com',
    feedback: 'I appreciate not having to create an account to complete my purchase.',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000) // 17 days ago
  },
  {
    id: '19',
    email: 'slow.connection@example.com',
    feedback: 'The checkout page takes forever to load on my rural internet connection.',
    sentiment: 'negative',
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) // 18 days ago
  },
  {
    id: '20',
    email: 'delivery.focused@example.com',
    feedback: 'The shipping cost calculator is accurate and I love seeing the estimated delivery date.',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) // 19 days ago
  }
];

// Format the date as a relative time (e.g., "2 days ago") and absolute time
const formatTimestamp = (date: Date) => {
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  const absoluteTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">{absoluteTime}</span>
      <span className="text-xs text-muted-foreground">{relativeTime}</span>
    </div>
  );
};

// Get the appropriate badge color for each sentiment
const getSentimentBadge = (sentiment: Feedback['sentiment']) => {
  switch (sentiment) {
    case 'positive':
      return <Badge className="bg-green-500 hover:bg-green-600">Positive</Badge>;
    case 'neutral':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Neutral</Badge>;
    case 'negative':
      return <Badge className="bg-red-500 hover:bg-red-600">Negative</Badge>;
  }
};

// AI Digest component
const AIDigest = ({ feedbackData }: { feedbackData: Feedback[] }) => {
  // Calculate sentiment distribution
  const sentimentCounts = feedbackData.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalFeedback = feedbackData.length;
  const positivePercentage = Math.round((sentimentCounts.positive || 0) / totalFeedback * 100);
  const neutralPercentage = Math.round((sentimentCounts.neutral || 0) / totalFeedback * 100);
  const negativePercentage = Math.round((sentimentCounts.negative || 0) / totalFeedback * 100);

  // Identify common themes (this would be more sophisticated in a real AI system)
  const commonPositiveThemes = "Checkout speed, mobile experience, new design, payment options";
  const commonNegativeThemes = "Payment errors, loading times, process complexity";
  const suggestions = "Consider optimizing payment processing, improving mobile performance, and simplifying the checkout flow";

  return (
    <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareText className="h-5 w-5 text-indigo-500" />
        <h3 className="text-md font-medium">AI Feedback Digest</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <h4 className="text-sm font-medium mb-1">Sentiment Distribution</h4>
          <div className="text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Positive: {positivePercentage}% ({sentimentCounts.positive || 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Neutral: {neutralPercentage}% ({sentimentCounts.neutral || 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Negative: {negativePercentage}% ({sentimentCounts.negative || 0})</span>
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

const UserFeedbackTable: React.FC = () => {
  // Sort the feedback data by timestamp in descending order
  const sortedFeedbackData = [...feedbackData].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] font-semibold">User Feedback</h2>
      </div>
      
      <AIDigest feedbackData={feedbackData} />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFeedbackData.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell className="font-medium">{feedback.email}</TableCell>
              <TableCell className="max-w-md">
                <div className="line-clamp-2">{feedback.feedback}</div>
              </TableCell>
              <TableCell>{getSentimentBadge(feedback.sentiment)}</TableCell>
              <TableCell className="text-right">{formatTimestamp(feedback.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserFeedbackTable;
