# Presentation Quick Reference Card

## 🎯 Actions & Code Files (15-Minute Demo)

### **1. Basic Event Creation** (3 min)
**Actions:**
- Enter phone number → Click "Event Title" → Enter title → Save
- Click "Date and Time" → Select dates → Save
- Click "Location" → Type location → Select from autocomplete → Save
- Click "Cost per Person" → Enter price → Save
- Click "Description" → Enter text → Save

**Code Files:**
- `components/panels/EventForm.tsx` - Main form
- `components/panels/InputModal.tsx` - Text inputs
- `components/panels/DateTimeModal.tsx` - Date picker
- `components/panels/LocationModal.tsx` - Location search
- `lib/recoil/actions.ts` (lines 12-71) - `createEvent()`, `updateEvent()`

---

### **2. Flyer Image with Cropping** (3 min)
**Actions:**
- Hover flyer card → Click edit button → Select image
- Crop modal opens → Drag crop area → Click "Crop"
- Show cropped image in flyer card

**Code Files:**
- `components/panels/FlyerCard.tsx` - Flyer display
- `components/panels/CropModal.tsx` - Cropping interface
- `lib/recoil/actions.ts` (lines 22-38) - `updateEventFlyer()`

---

### **3. Background Image** (1.5 min)
**Actions:**
- Click "Change background" button → Select image
- Show background updates immediately

**Code Files:**
- `components/panels/LeftPanel.tsx` - Background button
- `components/EventBuilderPage.tsx` (lines 12-22) - Background styling
- `lib/recoil/actions.ts` (lines 73-89) - `updateEventBackground()`

---

### **4. Custom Modules** (3 min)
**Actions:**
- Click "Customize" button → Module modal opens
- Search for "Photo Gallery" → Click it → Module appears
- Click Photo Gallery row → Upload images → Save
- Add "Privacy" module → Click row → Select "Private" → Save

**Code Files:**
- `components/panels/CustomizeCard.tsx` - Customize button
- `components/panels/ButtonListModal.tsx` - Module selector
- `components/panels/PhotoGalleryModal.tsx` - Photo gallery
- `components/panels/PrivacyModal.tsx` - Privacy settings
- `components/ModuleRenderer.tsx` - Module rendering
- `lib/recoil/actions.ts` (lines 91-116) - `addModuleToEvent()`

---

### **5. Backend Architecture** (2.5 min)
**Actions:**
- Open `lib/api/mockBackend.ts` in IDE
- Show TODO comments
- Explain 1-2 line replacement per function
- Show how `actions.ts` calls backend

**Code Files:**
- `lib/api/mockBackend.ts` - Mock backend (entire file)
- `lib/recoil/actions.ts` - Backend integration (lines 14, 24, 57, 75, 93)

**Key Example:**
```typescript
// mockBackend.ts - Line 8
// TODO: Replace with actual API call:
// const response = await fetch('/api/events', { method: 'POST', ... })
```

---

### **6. Technical Highlights** (1.5 min)
**Show:**
- Component structure
- TypeScript types
- Recoil state management
- Glassmorphism styles

**Code Files:**
- `lib/recoil/atoms.ts` - State definitions
- `types/event.ts` - TypeScript interfaces
- `app/globals.css` - Styles

---

## 📋 Quick Navigation Guide

| Feature | Component File | Action File | State File |
|---------|---------------|-------------|------------|
| Event Form | `panels/EventForm.tsx` | `recoil/actions.ts` | `recoil/atoms.ts` |
| Flyer Crop | `panels/CropModal.tsx` | `recoil/actions.ts` (line 22) | `recoil/atoms.ts` |
| Background | `panels/LeftPanel.tsx` | `recoil/actions.ts` (line 73) | `recoil/atoms.ts` |
| Modules | `panels/ButtonListModal.tsx` | `recoil/actions.ts` (line 91) | `recoil/atoms.ts` |
| Backend | `api/mockBackend.ts` | `recoil/actions.ts` | - |

---

## 🎤 Key Talking Points

1. **Easy Backend Replacement**: Change 1-2 lines in `mockBackend.ts`
2. **State Management**: Recoil for clean, scalable state
3. **Type Safety**: Full TypeScript implementation
4. **Modular Architecture**: Easy to extend and maintain
5. **User Experience**: Intuitive modals, real-time updates
6. **Advanced Features**: Image cropping, location autocomplete, dynamic modules

---

## ⚡ Emergency Shortcuts

**If running short on time, focus on:**
1. Event creation (section 1)
2. Flyer cropping (section 2)
3. Custom modules (section 4)
4. Backend architecture (section 5)

**Skip or shorten:**
- Background change (section 3) - can mention briefly
- Technical details (section 6) - can summarize quickly

---

## 🔍 Code Search Commands (for IDE)

- **Find all backend calls**: Search for `mockBackend.`
- **Find all Recoil actions**: Search for `useEventActions`
- **Find all modals**: Search for `Modal.tsx` in `components/panels/`
- **Find state atoms**: Open `lib/recoil/atoms.ts`

---

**Keep this open during presentation for quick reference!**

