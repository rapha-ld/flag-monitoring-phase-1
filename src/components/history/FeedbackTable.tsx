
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Feedback {
  id: string;
  email: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
}

interface FeedbackTableProps {
  feedbackData: Feedback[];
}

const formatTimestamp = (date: Date) => {
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  const absoluteTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
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

const getSentimentBadge = (sentiment: Feedback['sentiment']) => {
  switch (sentiment) {
    case 'positive':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">Positive</Badge>;
    case 'neutral':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900">Neutral</Badge>;
    case 'negative':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900">Negative</Badge>;
  }
};

const FeedbackTable: React.FC<FeedbackTableProps> = ({ feedbackData }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Feedback</TableHead>
          <TableHead>Sentiment</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbackData.length > 0 ? (
          feedbackData.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell className="font-medium">{feedback.email}</TableCell>
              <TableCell className="max-w-md">
                <div className="line-clamp-2">{feedback.feedback}</div>
              </TableCell>
              <TableCell>{getSentimentBadge(feedback.sentiment)}</TableCell>
              <TableCell className="text-right">{formatTimestamp(feedback.timestamp)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
              {feedbackData.length === 0 ? 'No feedback found' : 'No matching feedback found'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FeedbackTable;
