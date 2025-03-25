import React, { useState } from 'react';
import { Feedback } from './types';
import FeedbackSummary from './FeedbackSummary';
import FeedbackFilters from './FeedbackFilters';
import FeedbackTable from './FeedbackTable';

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

const UserFeedbackTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  
  const filteredFeedbackData = feedbackData.filter(feedback => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      feedback.email.toLowerCase().includes(query) ||
      feedback.feedback.toLowerCase().includes(query) ||
      feedback.sentiment.toLowerCase().includes(query);
    
    const matchesSentiment = 
      sentimentFilter === 'all' || 
      feedback.sentiment === sentimentFilter;
    
    return matchesSearch && matchesSentiment;
  });
  
  const sortedFeedbackData = [...filteredFeedbackData].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <FeedbackSummary feedbackData={feedbackData} />
      
      <FeedbackFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sentimentFilter={sentimentFilter}
        setSentimentFilter={setSentimentFilter}
      />
      
      <FeedbackTable feedbackData={sortedFeedbackData} />
    </div>
  );
};

export default UserFeedbackTable;
