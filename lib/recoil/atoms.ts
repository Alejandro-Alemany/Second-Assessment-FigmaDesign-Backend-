import { atom } from 'recoil';
import { Event, QuickLink } from '@/types/event';

export const eventsState = atom<Event[]>({
  key: 'eventsState',
  default: [],
});

export const currentEventState = atom<Event | null>({
  key: 'currentEventState',
  default: null,
});

export const quickLinksState = atom<QuickLink[]>({
  key: 'quickLinksState',
  default: [
    {
      id: '1',
      label: 'Ticket Sales',
      moduleType: 'tickets',
      code: 'ticket-module',
    },
    {
      id: '2',
      label: 'RSVP Form',
      moduleType: 'rsvp',
      code: 'rsvp-module',
    },
    {
      id: '3',
      label: 'Countdown Timer',
      moduleType: 'countdown',
      code: 'countdown-module',
    },
    {
      id: '4',
      label: 'Social Share',
      moduleType: 'social',
      code: 'social-module',
    },
  ],
});

