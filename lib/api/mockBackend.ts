import { Event, CustomModule, QuickLink } from '@/types/event';

// Mock backend service - Replace with actual API calls by changing just these functions

export const mockBackend = {
  // Create a new event
  createEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'modules'>): Promise<Event> => {
    // TODO: Replace with actual API call: return await fetch('/api/events', { method: 'POST', body: JSON.stringify(eventData) })
    
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...eventData,
      modules: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return newEvent;
  },

  // Update event flyer image
  updateFlyerImage: async (eventId: string, imageUrl: string): Promise<Event> => {
    // TODO: Replace with actual API call: return await fetch(`/api/events/${eventId}/flyer`, { method: 'PUT', body: JSON.stringify({ imageUrl }) })
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as Event; // Will be updated via recoil state
  },

  // Update event background image
  updateBackgroundImage: async (eventId: string, imageUrl: string): Promise<Event> => {
    // TODO: Replace with actual API call: return await fetch(`/api/events/${eventId}/background`, { method: 'PUT', body: JSON.stringify({ imageUrl }) })
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as Event; // Will be updated via recoil state
  },

  // Update event fields (partial update)
  updateEvent: async (eventId: string, updates: Partial<Event>): Promise<Event> => {
    // TODO: Replace with actual API call: return await fetch(`/api/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(updates) })
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as Event; // Will be updated via recoil state
  },

  // Add a module to an event
  addModule: async (eventId: string, module: CustomModule): Promise<Event> => {
    // TODO: Replace with actual API call: return await fetch(`/api/events/${eventId}/modules`, { method: 'POST', body: JSON.stringify(module) })
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as Event; // Will be updated via recoil state
  },

  // Get quick links
  getQuickLinks: async (): Promise<QuickLink[]> => {
    // TODO: Replace with actual API call: return await fetch('/api/quick-links')
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
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
    ];
  },
};

