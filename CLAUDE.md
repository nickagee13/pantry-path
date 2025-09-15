# PantryPath - Project Context for Claude Code

## Project Overview

PantryPath is a smart grocery and kitchen inventory management app that helps users track their shopping across multiple stores, manage their home inventory, and get recipe suggestions based on what they have.

**Creator**: Nick Agee (Freelance Audio Engineer exploring app development)
**Repository**: https://github.com/nickagee13/pantry-path
**Current Stage**: MVP HTML complete (v13), ready for React/Vite conversion

## Core Concept & User Flow

### Personal Workflow (Nick's Use Case)

1. **Add ingredients to grocery list** (manually or from saved recipes)
2. **App auto-organizes by store** (Farmers Market, Costco, Whole Foods, etc.)
3. **Within each store, items auto-sort by sections** (Produce, Dairy, etc.)
4. **Go shopping** - check off items, they move to home inventory
5. **Cook** - app suggests recipes based on inventory, prioritizing expiring items
6. **Smart notifications** - expiration alerts, low stock warnings

## Key Features Implemented in MVP

### Grocery List View

- Multi-store organization with collapsible cards
- Items auto-sort to bottom when checked
- "Completed!" badge when all store items are checked
- Shopping mode toggle (hides search/stats for focused shopping)
- Search functionality
- Family member attribution ("Added by Sarah")

### Kitchen Inventory View

- Visual cards with progress bars showing quantity remaining
- Expiration tracking with color-coded alerts
- Swipe gestures:
  - Swipe left → Remove from inventory
  - Swipe right → Add to grocery list
- Category filtering (Dairy, Fruits, Veggies, Meat, Pantry, Frozen)

### Recipes View

- Smart suggestions based on current inventory
- "Can Make: X Recipes" stat shows recipes with all ingredients available
- Cuisine tags (Italian 🍝, Chinese 🥢, Mexican 🌮, Thai 🌶️, American 🍔)
- Filter pills: All, Favorites, Expiring Items, Quick Meals, Healthy, Comfort Food
- Additional cuisine filters
- Recipe badges: "Ready" (green) or "X Missing" (peach)
- Prioritizes recipes using expiring ingredients

### Add Items View

- Smart suggestions based on:
  - Frequently bought items
  - Items running low
  - Purchase history
- Store selection with learned preferences
- Quantity input (optional)

### Settings View

- Dark mode toggle
- Store management (configure default categories)
- Notification preferences:
  - Expiration alerts (2 days before)
  - Low stock alerts (below 25%)
  - Recipe suggestions
- Family sharing with member management

## Design System

### Color Palette

```css
/* Light Mode */
--bg-primary: #f8f9fd;
--bg-secondary: #ffffff;
--accent-green: #4caf50;
--accent-blue: #2196f3;
--accent-purple: #9c27b0;
--accent-yellow: #ffe082;
--accent-pink: #ffd6e8;
--accent-mint: #b2dfdb;
--accent-peach: #ffccbc;
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;

/* Dark Mode */
--bg-primary: #000000;
--bg-secondary: #1c1c1e;
```

### Visual Elements

- Gradient stat cards (yellow, blue, green)
- Gradient cuisine tags with unique colors
- Border radius: 12px (sm), 16px (md), 24px (lg)
- Subtle shadows for depth
- Smooth animations (0.3s transitions)

## Technical Implementation Notes

### State Management Structure

```javascript
{
  activeView: 'grocery-view',
  shoppingMode: false,
  darkMode: false,
  groceryList: {
    'Store Name': [items...]
  },
  inventory: [items...],
  recipes: [recipes...],
  stores: ['Farmers Market', 'Costco', 'Whole Foods', 'Trader Joe\'s'],
  userPreferences: {}
}
```

### Key Interactions to Preserve

1. **Checkbox behavior**: Click to check, auto-sort to bottom, update store badge
2. **Store card collapse**: Click header to toggle
3. **Swipe gestures**: Touch handling for inventory cards
4. **Filter pills**: Active state styling, smooth transitions
5. **Shopping mode**: Hides non-essential UI elements
6. **View switching**: Bottom nav updates, smooth transitions

### Component Breakdown

- **GroceryListView**: Contains StoreCard components
- **StoreCard**: Collapsible container with ListItem children
- **ListItem**: Checkbox, name, quantity, metadata
- **InventoryCard**: Swipeable card with progress bar
- **RecipeCard**: Header, cuisine tags, info, ingredients
- **FilterPills**: Reusable component for all filter sections
- **BottomNav**: Fixed navigation with active state
- **FAB**: Floating action button for quick add

## Critical Requirements for React Conversion

1. **Exact Visual Parity**: The React app must look identical to the HTML MVP
2. **All Features Working**: Every interaction from the HTML version must work
3. **Mobile-First**: Optimized for phone screens (max-width: 430px)
4. **Smooth Animations**: Preserve all transitions and hover effects
5. **State Persistence**: Use React state (later will add localStorage)

## Future Enhancements (Post-MVP)

- Supabase backend integration
- Real-time sync across devices
- Barcode scanning
- Recipe import from URLs
- AI-powered recipe suggestions

## Development Workflow

Following Nick's App Dev Workflow:

1. ✅ Brainstorm basic app ideas (features, what problems does it solve, naming, UI/UX)
2. ✅ Build the basic Ul only (dummy data) (HTML)
3. ✅ Set up new GitHub repo + create Vite Project structure locally
4. ✅ Link repo, commit and push MVP to Github via Terminal
5. 🎯 Migrate HTML code over to new Vite project in VS Code (CURRENT)
6. Create data structure and backend with Supabase
7. Connect both Ul with backend
8. Deploy working MVP to Netlify
9. Ul Polish (Get UI/UX inspiration)

## Important Context

- Nick is new to React/app development, needs clear explanations
- Prefers step-by-step guidance
- Values clean, organized code
- Wants to maintain all the thoughtful UX details from the MVP
- App name "PantryPath" was chosen from several options for its flow concept

## Files to Reference

- **MVP HTML**: The complete v13 HTML structure with all features
- **This CLAUDE.MD**: Project context and requirements
- **Setup Prompt**: Instructions for Claude Code

When implementing in React, ensure every feature, animation, and interaction from the HTML version is preserved exactly.

---

## Development Session Notes

**Current State**:

- Developing Vite/React app to look identical to HTML MVP v13

**Key Lesson**: Always read and reference the existing HTML file first before implementing React components. The HTML MVP contains all the design decisions and should be the source of truth for the React implementation.

## Future Native iOS Deployment Strategy

### End Goal: Capacitor for iOS App Store

**Decision**: Use Capacitor to convert the React/Vite PantryPath app to native iOS, avoiding the need to learn Swift while maintaining our existing codebase.

### Development Guidelines for Capacitor Readiness

When building features, keep these Capacitor considerations in mind:

1. **Mobile-First Always**: All UI decisions should prioritize mobile experience
2. **Touch-Friendly**: Ensure all interactions work well with fingers, not just mouse
3. **Performance Conscious**: Optimize for mobile devices (smaller bundle sizes, efficient rendering)
4. **Offline Capabilities**: Design state management to work offline (localStorage, eventual sync)
5. **Native Feature Hooks**: Structure code to easily integrate native features later:
   - Camera access for barcode scanning
   - Push notifications for expiration alerts
   - Local file system for data caching

### Capacitor Integration Timeline

**Phase 1: Current (React/Vite MVP)**

- Build full-featured web app
- Perfect mobile UX/UI
- Complete core functionality

**Phase 2: Capacitor Setup**

- Add Capacitor to existing project
- Test iOS build and app store submission process
- Handle any mobile-specific adjustments

**Phase 3: Native Features**

- Add camera for barcode scanning
- Implement push notifications
- Optimize for app store guidelines

### Code Structure Notes

- Keep all styling mobile-responsive
- Use CSS custom properties (already implemented) for easy theming
- Maintain clean component structure for easy Capacitor integration
- Avoid web-only APIs that won't work in native wrapper

### Why Capacitor vs Swift

- **Maintains current React expertise**
- **Faster time to App Store**
- **Single codebase for web + mobile**
- **Can always rebuild native later if needed**
- **Leverages existing PantryPath investment**

_This strategy allows for "vibe coding" approach while keeping native iOS deployment as the ultimate goal._
