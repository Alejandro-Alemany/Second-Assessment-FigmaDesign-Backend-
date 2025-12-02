# 15-Minute Presentation Script: Event Builder Application

## Pre-Presentation Setup (Before Starting)
1. **Start the development server**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`
3. **Prepare screen share**: Have your IDE and browser ready
4. **Have sample images ready**: Prepare 2-3 images for flyer and background demo

---

## Presentation Timeline (15 minutes)

### **Introduction & Overview** (2 minutes)

**What to say:**
> "Today I'll be presenting an Event Builder Application built with Next.js, React, TypeScript, and Recoil. This is a comprehensive event creation platform that allows users to create and customize events with advanced features like image cropping, dynamic modules, and a flexible backend architecture."

**Action:**
- Show the main application interface
- Point out the two-panel layout (left: flyer, right: event form)

**Code Reference:**
- `components/EventBuilderPage.tsx` - Main layout component
- `app/page.tsx` - Entry point

---

### **1. Basic Event Creation** (3 minutes)

**What to say:**
> "Let me start by creating a basic event. The application uses Recoil for state management, which provides a clean separation between UI and data logic."

**Actions to perform:**
1. **Enter phone number** in the phone input field (right panel)
2. **Click on "Event Title" row** → Opens InputModal
3. **Type an event title** (e.g., "Summer Music Festival 2024")
4. **Click "Save"**
5. **Click on "Date and Time" row** → Opens DateTimeModal
6. **Select start and end dates** using the calendar
7. **Click "Save"**
8. **Click on "Location" row** → Opens LocationModal
9. **Type a location** (e.g., "New York") → Show autocomplete suggestions
10. **Select a location** from suggestions
11. **Click "Save"**
12. **Click on "Cost per Person" row** → Enter a price
13. **Click on "Description" row** → Enter description text

**What to highlight:**
- Real-time state updates
- Modal-based editing interface
- Location autocomplete with OpenStreetMap API
- Date validation (end date can't be before start date)

**Code References:**
- `components/panels/EventForm.tsx` - Main form component
- `components/panels/InputModal.tsx` - Generic text input modal
- `components/panels/DateTimeModal.tsx` - Date/time picker (lines 1-200)
- `components/panels/LocationModal.tsx` - Location autocomplete (lines 1-150)
- `lib/recoil/actions.ts` - `createEvent()` and `updateEvent()` functions (lines 12-71)
- `lib/recoil/atoms.ts` - State definitions

**Key Code to Show:**
```typescript
// lib/recoil/actions.ts - Line 12-20
const createEvent = async (eventData) => {
  const newEvent = await mockBackend.createEvent(eventData);
  setEvents([...events, newEvent]);
  setCurrentEvent(newEvent);
  return newEvent;
};
```

---

### **2. Flyer Image Management with Cropping** (3 minutes)

**What to say:**
> "Now let's add a flyer image. The application includes an advanced image cropping feature with a draggable crop area and visual grid overlay."

**Actions to perform:**
1. **Hover over the flyer card** (left panel) → Edit button appears
2. **Click the edit button** (bottom right of flyer card)
3. **Select an image file** from your computer
4. **Crop Modal Opens**:
   - Show the draggable crop area
   - Point out the 3x3 grid overlay (rule of thirds)
   - **Drag the crop area** to reposition it
   - Show the square aspect ratio constraint
5. **Click "Crop" button**
6. **Show the cropped image** appears in the flyer card

**What to highlight:**
- Advanced cropping with canvas API
- Visual feedback with grid overlay
- Square aspect ratio for consistent flyer display
- Real-time preview

**Code References:**
- `components/panels/FlyerCard.tsx` - Flyer display with edit button
- `components/panels/CropModal.tsx` - Image cropping interface (entire file)
- `lib/recoil/actions.ts` - `updateEventFlyer()` function (lines 22-38)

**Key Code to Show:**
```typescript
// components/panels/CropModal.tsx - Show canvas-based cropping
// lib/recoil/actions.ts - Line 22-38
const updateEventFlyer = async (eventId: string, imageUrl: string) => {
  await mockBackend.updateFlyerImage(eventId, imageUrl);
  // Updates Recoil state...
};
```

---

### **3. Background Image Customization** (1.5 minutes)

**What to say:**
> "Users can also customize the full page background image, which creates a more personalized event experience."

**Actions to perform:**
1. **Click "Change background" button** (below flyer card, left panel)
2. **Select an image file**
3. **Show the background updates immediately** across the entire page
4. **Mention** that the background persists with the event

**What to highlight:**
- Full-page background customization
- Immediate visual feedback
- Background persists in event state

**Code References:**
- `components/panels/LeftPanel.tsx` - Background change button
- `components/EventBuilderPage.tsx` - Background styling (lines 12-22)
- `lib/recoil/actions.ts` - `updateEventBackground()` function (lines 73-89)

**Key Code to Show:**
```typescript
// components/EventBuilderPage.tsx - Lines 12-22
const backgroundStyle = currentEvent?.backgroundImage
  ? {
      backgroundImage: `url(${currentEvent.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  : { background: defaultGradient };
```

---

### **4. Customizable Modules via Quick-Links** (3 minutes)

**What to say:**
> "One of the most powerful features is the ability to add customizable modules through quick-links. These modules are defined by the backend and can be dynamically added to events."

**Actions to perform:**
1. **Click "Customize" button** (in the Customize card, right panel)
2. **Module Selector Modal Opens**:
   - Show the list of available modules (Capacity, Photo Gallery, Links, Privacy, etc.)
   - **Type in search bar** to filter modules (e.g., "photo")
3. **Click "Photo Gallery" module**
4. **Show the module appears** as a new row in the event form
5. **Click on the Photo Gallery row** → Opens PhotoGalleryModal
6. **Click "Upload Images" button**
7. **Select multiple images**
8. **Show images appear in grid**
9. **Click X on one image** to remove it
10. **Click "Save"**
11. **Add another module** (e.g., "Privacy")
12. **Click Privacy row** → Opens PrivacyModal
13. **Select "Private" option**
14. **Click "Save"**

**What to highlight:**
- Dynamic module addition
- Backend-defined module rendering
- Search functionality
- Each module has its own specialized modal
- Modules are rendered using code from backend

**Code References:**
- `components/panels/CustomizeCard.tsx` - Customize button
- `components/panels/ButtonListModal.tsx` - Module selection modal
- `components/panels/PhotoGalleryModal.tsx` - Photo gallery management
- `components/panels/PrivacyModal.tsx` - Privacy settings
- `components/ModuleRenderer.tsx` - Renders backend-defined modules
- `lib/recoil/actions.ts` - `addModuleToEvent()` function (lines 91-116)
- `lib/buttonConfig.tsx` - Button/module configuration

**Key Code to Show:**
```typescript
// lib/recoil/actions.ts - Lines 91-116
const addModuleToEvent = async (eventId: string, module: CustomModule) => {
  await mockBackend.addModule(eventId, module);
  // Updates Recoil state with new module...
};

// components/ModuleRenderer.tsx - Shows how backend code is executed
```

---

### **5. Backend Architecture & Easy Replacement** (2.5 minutes)

**What to say:**
> "One of the key architectural decisions was to make backend integration extremely simple. The entire backend can be replaced by changing just 1-2 lines per API call."

**Actions to perform:**
1. **Open IDE** and navigate to `lib/api/mockBackend.ts`
2. **Show the mock backend structure**
3. **Point out the TODO comments** in each function
4. **Show an example** of how to replace with real API

**What to highlight:**
- All backend calls centralized in one file
- Clear TODO comments showing exactly what to replace
- Recoil actions call backend through this layer
- Only 1-2 lines need to change per function

**Code References:**
- `lib/api/mockBackend.ts` - Entire file (lines 1-87)
- `lib/recoil/actions.ts` - Shows how backend is called (lines 14, 24, 57, 75, 93)

**Key Code to Show:**
```typescript
// lib/api/mockBackend.ts - Lines 7-21
createEvent: async (eventData) => {
  // TODO: Replace with actual API call: 
  // const response = await fetch('/api/events', { 
  //   method: 'POST', 
  //   body: JSON.stringify(eventData) 
  // })
  // return await response.json()
  
  // Mock implementation...
  await new Promise(resolve => setTimeout(resolve, 500));
  return newEvent;
}

// Show how it's called in actions.ts - Line 14
const newEvent = await mockBackend.createEvent(eventData);
```

**Demonstrate the replacement:**
- Show how changing just the function body in `mockBackend.ts` switches to real API
- All Recoil actions automatically use the new backend

---

### **6. Technical Highlights & Architecture** (1.5 minutes)

**What to say:**
> "Let me quickly highlight the technical architecture and key design decisions."

**Actions to perform:**
1. **Show component structure** in IDE
2. **Point out key files**:
   - State management (Recoil atoms/actions)
   - Component organization
   - Type safety with TypeScript

**What to highlight:**
- **Tech Stack**: Next.js 14, React 18, TypeScript, Recoil
- **State Management**: Centralized Recoil atoms and actions
- **Component Architecture**: Modular, reusable components
- **Type Safety**: Full TypeScript implementation
- **Glassmorphism Design**: Modern UI with translucent effects
- **Performance**: Debounced searches, optimized re-renders

**Code References:**
- `lib/recoil/atoms.ts` - State definitions
- `types/event.ts` - TypeScript interfaces
- `components/` directory structure
- `app/globals.css` - Glassmorphism styles

**Key Points:**
- Clean separation of concerns
- Easy to extend and maintain
- Production-ready code quality
- All requirements met plus additional features

---

### **7. Q&A & Closing** (1.5 minutes)

**What to say:**
> "The application is fully functional and ready for deployment. All core requirements have been met, and we've added several enhancements like advanced image cropping, location autocomplete, and a flexible module system. The backend can be integrated with just minimal changes, making it easy to connect to any API."

**Actions to perform:**
- Show the "Go live" button (if visible)
- Summarize key features
- Be ready for questions

**Key Takeaways to Emphasize:**
1. ✅ All core requirements implemented
2. ✅ Easy backend replacement (1-2 lines per call)
3. ✅ Modern, intuitive user interface
4. ✅ Advanced features (cropping, autocomplete, modules)
5. ✅ Production-ready code quality
6. ✅ Type-safe with TypeScript
7. ✅ Scalable architecture

---

## Quick Reference: Code Files by Feature

### **Event Creation**
- `components/panels/EventForm.tsx` - Main form
- `components/panels/InputModal.tsx` - Text inputs
- `components/panels/DateTimeModal.tsx` - Date/time picker
- `components/panels/LocationModal.tsx` - Location search
- `lib/recoil/actions.ts` - `createEvent()`, `updateEvent()`

### **Flyer Management**
- `components/panels/FlyerCard.tsx` - Flyer display
- `components/panels/CropModal.tsx` - Image cropping
- `lib/recoil/actions.ts` - `updateEventFlyer()`

### **Background Customization**
- `components/panels/LeftPanel.tsx` - Background button
- `components/EventBuilderPage.tsx` - Background styling
- `lib/recoil/actions.ts` - `updateEventBackground()`

### **Custom Modules**
- `components/panels/CustomizeCard.tsx` - Customize button
- `components/panels/ButtonListModal.tsx` - Module selector
- `components/panels/PhotoGalleryModal.tsx` - Photo gallery
- `components/panels/PrivacyModal.tsx` - Privacy settings
- `components/ModuleRenderer.tsx` - Module rendering
- `lib/recoil/actions.ts` - `addModuleToEvent()`
- `lib/buttonConfig.tsx` - Module configuration

### **Backend Architecture**
- `lib/api/mockBackend.ts` - Mock backend (easy to replace)
- `lib/recoil/actions.ts` - Backend integration layer
- `lib/recoil/atoms.ts` - State management

### **Main Components**
- `components/EventBuilderPage.tsx` - Main layout
- `components/panels/LeftPanel.tsx` - Left panel
- `components/panels/RightPanel.tsx` - Right panel
- `app/page.tsx` - Entry point

---

## Tips for a Great Presentation

1. **Practice the flow** before presenting
2. **Have sample images ready** for flyer and background
3. **Keep IDE and browser side-by-side** for easy code reference
4. **Speak clearly** about the architecture decisions
5. **Emphasize the easy backend replacement** - it's a key selling point
6. **Show confidence** in the code quality and structure
7. **Be ready to answer** questions about:
   - Why Recoil over Redux/Context?
   - How modules are rendered from backend code?
   - Performance optimizations?
   - Deployment considerations?

---

## Troubleshooting During Presentation

- **If something doesn't work**: Stay calm, explain it's a demo environment
- **If asked about specific code**: Use the code references above to quickly navigate
- **If time is short**: Focus on sections 1, 2, 4, and 5 (most important)
- **If time is long**: Add more detail on architecture and design decisions

---

**Good luck with your presentation! 🚀**

