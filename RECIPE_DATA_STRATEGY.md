# Recipe Data Transition Strategy

## Current State
- Using dummy/mock recipe data in `src/data/mockData.js`
- Simple recipe objects with basic properties
- Limited recipe collection

## Goal
- Transition to real, comprehensive recipe database
- Support for recipe imports from URLs
- User recipe collection and management

## Implementation Plan

### Phase 1: Enhanced Data Structure (Immediate)
```javascript
{
  id: 'unique-id',
  name: 'Recipe Name',
  description: 'Brief description',
  image: 'url-to-image',
  prepTime: 15, // minutes
  cookTime: 30, // minutes
  totalTime: 45, // minutes
  servings: 4,
  difficulty: 'easy|medium|hard',
  cuisine: 'Italian',
  categories: ['dinner', 'vegetarian'],
  ingredients: [
    {
      name: 'tomatoes',
      amount: 2,
      unit: 'cups',
      notes: 'diced'
    }
  ],
  instructions: [
    {
      step: 1,
      instruction: 'Heat oil in large pan...',
      time: 5 // optional time for this step
    }
  ],
  nutrition: {
    calories: 350,
    protein: 15,
    carbs: 45,
    fat: 12
  },
  tags: ['quick', 'healthy', 'one-pot'],
  source: 'user-created|imported|api',
  sourceUrl: 'https://...' // if imported
}
```

### Phase 2: Recipe API Integration
**Option A: Recipe APIs**
- Spoonacular API (freemium, comprehensive)
- Edamam Recipe API (good nutrition data)
- RecipeDB (open source)

**Option B: Web Scraping**
- Recipe URL import functionality
- Parse structured data from popular recipe sites
- Extract ingredients, instructions, metadata

### Phase 3: Recipe Database Setup
**Storage Options:**
- Supabase table for user recipes
- JSON files for starter recipe collection
- Local storage for offline access

**Database Schema:**
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty TEXT,
  cuisine TEXT,
  ingredients JSONB,
  instructions JSONB,
  nutrition JSONB,
  tags TEXT[],
  source TEXT DEFAULT 'user-created',
  source_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Phase 4: Recipe Management Features
- Import from URL
- Create custom recipes
- Edit existing recipes
- Recipe sharing between family members
- Recipe rating and reviews
- Meal planning integration

## Starter Recipe Collection
Create 20-30 essential recipes covering:
- 5 breakfast recipes
- 8 dinner recipes (variety of cuisines)
- 5 lunch recipes
- 5 healthy/quick recipes
- 5 comfort food recipes

## Implementation Priority
1. **Week 1**: Enhanced data structure + 20 starter recipes
2. **Week 2**: Supabase recipe table + CRUD operations
3. **Week 3**: URL import functionality
4. **Week 4**: Recipe management UI

## Success Metrics
- User can add their own recipes
- Import recipes from favorite cooking sites
- Recipe suggestions work with real inventory matching
- Offline recipe access
- Recipe sharing within family accounts