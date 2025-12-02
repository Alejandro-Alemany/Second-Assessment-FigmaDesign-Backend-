import { useSetRecoilState, useRecoilValue } from 'recoil';
import { eventsState, currentEventState, quickLinksState } from './atoms';
import { Event, CustomModule } from '@/types/event';
import { mockBackend } from '@/lib/api/mockBackend';

// Event Actions - These call the backend (mocked) and update recoil state
export const useEventActions = () => {
  const setEvents = useSetRecoilState(eventsState);
  const setCurrentEvent = useSetRecoilState(currentEventState);
  const events = useRecoilValue(eventsState);

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'modules'>) => {
    // Call backend (1 line change to use real backend)
    const newEvent = await mockBackend.createEvent(eventData);
    
    // Update recoil state
    setEvents([...events, newEvent]);
    setCurrentEvent(newEvent);
    return newEvent;
  };

  const updateEventFlyer = async (eventId: string, imageUrl: string) => {
    // Call backend (1 line change to use real backend)
    await mockBackend.updateFlyerImage(eventId, imageUrl);
    
    // Update recoil state
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, flyerImage: imageUrl, updatedAt: new Date().toISOString() }
        : event
    );
    setEvents(updatedEvents);
    
    const currentEvent = events.find(e => e.id === eventId);
    if (currentEvent) {
      setCurrentEvent({ ...currentEvent, flyerImage: imageUrl, updatedAt: new Date().toISOString() });
    }
  };

  const updateEventFlyerText = async (eventId: string, text: string) => {
    // Update recoil state
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, flyerText: text, updatedAt: new Date().toISOString() }
        : event
    );
    setEvents(updatedEvents);
    
    const currentEvent = events.find(e => e.id === eventId);
    if (currentEvent) {
      setCurrentEvent({ ...currentEvent, flyerText: text, updatedAt: new Date().toISOString() });
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    // Call backend (1 line change to use real backend)
    await mockBackend.updateEvent(eventId, updates);
    
    // Update recoil state
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    );
    setEvents(updatedEvents);
    
    const currentEvent = events.find(e => e.id === eventId);
    if (currentEvent) {
      setCurrentEvent({ ...currentEvent, ...updates, updatedAt: new Date().toISOString() });
    }
  };

  const updateEventBackground = async (eventId: string, imageUrl: string) => {
    // Call backend (1 line change to use real backend)
    await mockBackend.updateBackgroundImage(eventId, imageUrl);
    
    // Update recoil state
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, backgroundImage: imageUrl, updatedAt: new Date().toISOString() }
        : event
    );
    setEvents(updatedEvents);
    
    const currentEvent = events.find(e => e.id === eventId);
    if (currentEvent) {
      setCurrentEvent({ ...currentEvent, backgroundImage: imageUrl, updatedAt: new Date().toISOString() });
    }
  };

  const addModuleToEvent = async (eventId: string, module: CustomModule) => {
    // Call backend (1 line change to use real backend)
    await mockBackend.addModule(eventId, module);
    
    // Update recoil state
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          modules: [...event.modules, module],
          updatedAt: new Date().toISOString(),
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    
    const currentEvent = events.find(e => e.id === eventId);
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        modules: [...currentEvent.modules, module],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const setCurrentEventById = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setCurrentEvent(event);
    }
  };

  return {
    createEvent,
    updateEventFlyer,
    updateEventFlyerText,
    updateEventBackground,
    updateEvent,
    addModuleToEvent,
    setCurrentEventById,
  };
};

