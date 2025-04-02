
import { HistoryEvent } from "./types";

export const historyData: HistoryEvent[] = [
  {
    id: '1',
    type: 'enabled',
    title: 'Flag enabled',
    description: 'New checkout flow was enabled for production',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 17 * 60 * 1000 + 37 * 1000), // 7 days ago
    initiatedBy: {
      name: 'John Smith',
      email: 'john.smith@example.com'
    }
  },
  {
    id: '2',
    type: 'updated',
    title: 'Flag updated',
    description: 'Target audience changed from 10% to 25% of users',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 42 * 60 * 1000 - 23 * 1000), // 14 days ago - updated from 30 days
    initiatedBy: {
      name: 'Emily Johnson',
      email: 'emily.j@example.com'
    }
  },
  {
    id: '3',
    type: 'disabled',
    title: 'Flag disabled',
    description: 'New checkout flow was disabled for production',
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000 + 11 * 1000), // 21 days ago - updated from 45 days
    initiatedBy: {
      name: 'Michael Chen',
      email: 'michael.c@example.com'
    }
  },
  {
    id: '7',
    type: 'alert',
    title: 'Alert',
    description: 'Avg. Error Rate exceeded alert threshold',
    timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000 - 13 * 60 * 1000 - 49 * 1000)
  },
  {
    id: '4',
    type: 'settings',
    title: 'Rules changed',
    description: 'New rule "LD users" was created',
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000 + 53 * 60 * 1000 + 7 * 1000),
    initiatedBy: {
      name: 'Sarah Parker',
      email: 'sarah.p@example.com'
    }
  },
  {
    id: '6',
    type: 'enabled', 
    title: 'Flag enabled',
    description: 'New checkout flow was enabled for testing',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 - 31 * 60 * 1000 - 15 * 1000),
    initiatedBy: {
      name: 'David Wilson',
      email: 'david.w@example.com'
    }
  },
  {
    id: '5',
    type: 'created',
    title: 'Flag created',
    description: 'New feature flag "New Checkout" was created',
    timestamp: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000 + 39 * 60 * 1000 + 42 * 1000),
    initiatedBy: {
      name: 'Alex Rodriguez',
      email: 'alex.r@example.com'
    }
  }
];
