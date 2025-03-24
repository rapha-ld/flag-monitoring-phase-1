
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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
