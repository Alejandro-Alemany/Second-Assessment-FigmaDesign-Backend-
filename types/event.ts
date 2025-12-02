export interface Event {
  id: string;
  title: string;
  description: string;
  phoneNumber?: string;
  dateTime?: string;
  location?: string;
  costPerPerson?: string;
  capacity?: string;
  photoGallery?: string[]; // Array of photo URLs
  links?: Array<{ title: string; url: string }>;
  privacy?: 'public' | 'private' | 'invite-only';
  questionnaires?: string; // JSON string or structured data
  announcements?: string[];
  invite?: string; // Invite configuration
  newSections?: Array<{ title: string; content: string }>;
  flyerImage?: string;
  flyerText?: string; // "YOU'RE INVITED" text
  backgroundImage?: string;
  modules: CustomModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomModule {
  id: string;
  type: string;
  code: string; // Code passed from backend to render
  config: Record<string, any>;
}

export interface QuickLink {
  id: string;
  label: string;
  moduleType: string;
  code: string; // Code that frontend will render
}

