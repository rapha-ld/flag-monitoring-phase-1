
export interface Feedback {
  id: string;
  email: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
}
