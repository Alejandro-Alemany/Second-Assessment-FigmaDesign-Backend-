# Event Builder Application

A comprehensive Next.js application for creating and customizing events with advanced features including image cropping, customizable modules, and a flexible backend architecture.

## 🎯 Project Overview

This application allows users to create and customize events with a beautiful, modern interface. The design features a two-panel layout with glassmorphism effects, dynamic form fields, and an intuitive user experience.

## ✨ Key Features

### 1. **Basic Event Creation**
- Create events with essential information:
  - Event title
  - Phone number (for draft saving)
  - Date and time (with calendar picker)
  - Location (with autocomplete suggestions)
  - Cost per person
  - Description
  - Capacity
- All fields are editable through modal interfaces
- Real-time state management with Recoil

### 2. **Flyer Image Management**
- **Image Upload**: Click the edit button on the flyer card to upload a new image
- **Image Cropping**: Advanced crop modal with:
  - Draggable crop area
  - Visual grid overlay (3x3 rule of thirds)
  - Square aspect ratio for flyer images
  - Real-time preview
  - Canvas-based image processing
- Seamless integration with event state

### 3. **Background Image Customization**
- Change the full page background image
- File upload support
- Automatic event creation if none exists
- Background persists across sessions

### 4. **Customizable Modules via Quick-Links**
- **Module Selection**: Click "Customize" button to open module selection modal
- **Available Modules**:
  - Capacity
  - Photo Gallery
  - Links
  - Privacy Settings
  - Questionnaires
  - Announcements
  - Invite
  - New Sections
- Each module adds a new row to the event form
- Modules can be dynamically added and removed
- Backend-defined module rendering (via code passed from backend)

### 5. **Advanced Form Features**

#### **Dynamic Field Management**
- Click any input row to open a modal for editing
- Fields can be added dynamically via customize buttons
- Smart button management:
  - Shows 3 buttons initially
  - "Show more" reveals all available buttons
  - Used buttons are automatically removed from the list

#### **Specialized Modals**
- **Date & Time Modal**: 
  - Start and end date/time selection
  - Calendar view with navigation
  - Validation (end date cannot be before start date)
  - Formatted display

- **Location Modal**:
  - Real-time autocomplete using OpenStreetMap Nominatim API
  - Debounced search for performance
  - Keyboard navigation support
  - "Use typed text" option
  - Transparent glassmorphism design

- **Photo Gallery Modal**:
  - Multiple image upload
  - Grid view of uploaded photos
  - Remove individual photos
  - File input support

- **Privacy Modal**:
  - Visual selection interface
  - Options: Public, Private, Invite Only
  - Radio button style selection

- **Other Modals**:
  - Links (multiple link management)
  - Questionnaires (text input)
  - Announcements (multi-line input)
  - Invite (configuration)
  - New Sections (custom content sections)

### 6. **User Interface Features**

#### **Glassmorphism Design**
- Translucent backgrounds with backdrop blur
- Subtle borders and shadows
- Consistent styling across all components
- Modern, elegant aesthetic

#### **Two-Panel Layout**
- **Left Panel**: 
  - Flyer card display
  - Background change button
  - Hover effects for editing

- **Right Panel**:
  - Event form with all fields
  - Customize card
  - Module display
  - "Go live" button
  - Hidden scrollbar (maintains scrolling functionality)

#### **Responsive Modals**
- Full-screen modal coverage (React Portals)
- Transparent backgrounds
- Smooth animations
- Keyboard support (Escape to close, Enter to save)

## 🏗️ Architecture

### **Backend Integration (Easy Replacement)**

The application uses a **mock backend** that can be replaced with real API calls by changing only **1-2 lines per backend call**.

#### **Structure**

All backend calls are centralized in `lib/api/mockBackend.ts`. Each method has a TODO comment showing exactly what to replace:

```typescript
// Example from mockBackend.ts
createEvent: async (eventData) => {
  // TODO: Replace with actual API call: 
  // const response = await fetch('/api/events', { 
  //   method: 'POST', 
  //   body: JSON.stringify(eventData) 
  // })
  // return await response.json()
  
  // Mock implementation...
}
```

#### **Recoil Actions Pattern**

All backend calls go through Recoil actions in `lib/recoil/actions.ts`:

```typescript
const createEvent = async (eventData) => {
  // Call backend (1 line change to use real backend)
  const newEvent = await mockBackend.createEvent(eventData);
  
  // Update recoil state
  setEvents([...events, newEvent]);
  setCurrentEvent(newEvent);
  return newEvent;
};
```

#### **How to Replace with Real Backend**

**Step 1:** Update `lib/api/mockBackend.ts` - Replace each function's implementation:

```typescript
// Before (Mock)
createEvent: async (eventData) => {
  // Mock implementation with simulated delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id: 'event-123', ...eventData };
}

// After (Real Backend)
createEvent: async (eventData) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  return await response.json();
}
```

**Step 2:** That's it! All Recoil actions will automatically use the real backend since they call `mockBackend.createEvent()`.

#### **Available Backend Methods**

- `createEvent(eventData)` - Create new event
- `updateEvent(eventId, updates)` - Update event fields (partial update)
- `updateFlyerImage(eventId, imageUrl)` - Update flyer image
- `updateBackgroundImage(eventId, imageUrl)` - Update background image
- `addModule(eventId, module)` - Add module to event
- `getQuickLinks()` - Get available quick links

**All methods follow the same pattern: Change 1-2 lines in `mockBackend.ts` and you're done!**

### **State Management**

- **Recoil Atoms** (`lib/recoil/atoms.ts`):
  - `eventsState` - Array of all events
  - `currentEventState` - Currently selected event
  - `quickLinksState` - Available quick-link modules

- **Recoil Actions** (`lib/recoil/actions.ts`):
  - All event operations (create, update, add modules)
  - Backend integration layer
  - State synchronization

### **Component Structure**

```
components/
├── EventBuilderPage.tsx      # Main page layout
├── panels/
│   ├── LeftPanel.tsx         # Flyer card and background button
│   ├── RightPanel.tsx        # Event form and modules
│   ├── FlyerCard.tsx         # Flyer display with edit button
│   ├── EventForm.tsx         # Main event form with all fields
│   ├── CustomizeCard.tsx     # Customize button and module selector
│   ├── InputModal.tsx        # Generic text input modal
│   ├── DateTimeModal.tsx     # Date/time picker with calendar
│   ├── LocationModal.tsx     # Location search with autocomplete
│   ├── PhotoGalleryModal.tsx # Photo gallery management
│   ├── PrivacyModal.tsx      # Privacy settings selector
│   ├── CropModal.tsx         # Image cropping interface
│   └── ButtonListModal.tsx   # Module selection modal
└── ModuleRenderer.tsx         # Renders backend-defined modules
```

## 🚀 Getting Started

### **Installation**

```bash
npm install
```

### **Development**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### **Build**

```bash
npm run build
npm start
```

## 📋 Feature Walkthrough

### **Creating an Event**

1. Enter a phone number in the phone input field
2. Click on any field row to edit:
   - **Event Title**: Click to open title modal
   - **Date and Time**: Opens calendar picker with start/end selection
   - **Location**: Opens location search with autocomplete
   - **Cost per Person**: Opens cost input modal
   - **Description**: Opens multi-line description modal

### **Adding Custom Fields**

1. Click the "Customize" button in the customize card
2. Modal opens showing all available modules
3. Search for modules using the search bar
4. Click any module to add it to the form
5. The module appears as a new row in the event form
6. Click the row to edit the module's content

### **Changing Flyer Image**

1. Hover over the flyer card (left panel)
2. Click the edit button (bottom right)
3. Select an image file
4. **Crop Modal Opens**:
   - Drag the crop area to position it
   - Use the grid lines for composition
   - Click "Crop" to apply
5. The cropped image is saved to the event

### **Changing Background**

1. Click "Change background" button (below flyer card)
2. Select an image file
3. Background updates immediately
4. Background persists with the event

### **Managing Photo Gallery**

1. Click "Photo gallery" button (or add via Customize)
2. Photo gallery row appears
3. Click the row to open Photo Gallery Modal
4. Click "Upload Images" button
5. Select multiple image files
6. Images appear in a grid
7. Click X on any photo to remove it
8. Click "Save" to apply changes

### **Setting Privacy**

1. Click "Privacy" button (or add via Customize)
2. Privacy row appears
3. Click the row to open Privacy Modal
4. Select from: Public, Private, or Invite Only
5. Click "Save"

## 🎨 Design Features

### **Glassmorphism**
- Applied throughout the right panel
- Translucent backgrounds: `rgba(255, 255, 255, 0.15)`
- Backdrop blur: `blur(20px)`
- Subtle borders and shadows
- Consistent across all cards and modals

### **Color Scheme**
- Purple gradient background: `linear-gradient(180deg, #E8D5FF 0%, #A78BFA 100%)`
- Dynamic background image support
- White text with varying opacity
- Smooth transitions and hover effects

### **Typography**
- Clean, modern sans-serif fonts
- Appropriate font weights and sizes
- Good contrast for readability

## 🔧 Technical Details

### **Tech Stack**
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Recoil** - State management
- **HTML5 Canvas** - Image cropping
- **OpenStreetMap Nominatim API** - Location autocomplete

### **Key Libraries & APIs**
- No external UI libraries (custom implementation)
- Native browser APIs for file handling
- Canvas API for image processing
- Fetch API for location search (ready for backend replacement)

### **Performance Optimizations**
- Debounced location search (prevents excessive API calls)
- React.memo for component optimization
- useCallback for stable function references
- Efficient state updates with Recoil

## 📝 Code Quality

### **Type Safety**
- Full TypeScript implementation
- Proper interface definitions
- Type-safe event handling

### **Component Organization**
- Modular component structure
- Reusable modal components
- Clear separation of concerns

### **Backend Abstraction**
- Clean separation between UI and backend
- Easy backend replacement
- Consistent API patterns

## 🎯 Requirements Compliance

✅ **All Core Requirements Met:**

1. ✅ **Basic Event Creation** - Fully implemented with all fields
2. ✅ **Flyer Image Change** - With advanced cropping feature
3. ✅ **Background Image Change** - Full page background support
4. ✅ **Customizable Modules** - Via quick-links with backend code rendering
5. ✅ **Backend Mocking** - Easy 1-2 line replacement per call
6. ✅ **Recoil Integration** - Complete state management solution
7. ✅ **Glassmorphism** - Applied after core features (as requested)

### **Additional Features Implemented:**
- Image cropping with drag-to-position
- Location autocomplete with real API
- Date/time validation
- Dynamic field management
- Search functionality in customize modal
- Multiple image upload
- Privacy settings selector
- And more...

## 🚀 Deployment

The application is ready for deployment to any Next.js-compatible platform:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting**

## 📚 File Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Recoil provider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── EventBuilderPage.tsx
│   ├── panels/             # All panel components
│   └── ModuleRenderer.tsx
├── lib/
│   ├── api/
│   │   └── mockBackend.ts  # Mock backend (easy to replace)
│   ├── recoil/
│   │   ├── atoms.ts        # Recoil state atoms
│   │   └── actions.ts      # Recoil actions
│   └── buttonConfig.tsx    # Button configuration
├── types/
│   └── event.ts            # TypeScript interfaces
└── README.md              # This file
```

## 🎓 Presentation Guide

### **Key Points to Highlight:**

1. **Easy Backend Replacement**: Show how changing 1-2 lines in `mockBackend.ts` switches to real API
2. **Modular Architecture**: Clean component structure, easy to extend
3. **User Experience**: Smooth interactions, intuitive modals, helpful features
4. **Code Quality**: TypeScript, proper state management, reusable components
5. **Feature Completeness**: All requirements met plus additional enhancements

### **Demo Flow:**

1. Start with creating a basic event
2. Show flyer image change with cropping
3. Demonstrate background change
4. Add modules via customize button
5. Show various field modals (date, location, etc.)
6. Explain backend architecture and easy replacement

## 📞 Support

For questions or issues, refer to the code comments and this README. The codebase is well-documented with clear structure and naming conventions.

---

**Built with ❤️ using Next.js, React, TypeScript, and Recoil**
