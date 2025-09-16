// Import store logos
import costcoLogo from '../assets/stores/costco.png';
import targetLogo from '../assets/stores/target.png';
import traderjosLogo from '../assets/stores/traderjoes.png';
import wholefoodsLogo from '../assets/stores/wholefoods.png';

export const mockGroceryList = {
  'Farmers Market': [
    {
      id: 1,
      name: 'Bell Peppers',
      quantity: '3 count',
      checked: false,
      addedBy: 'Elsie'
    },
    {
      id: 2,
      name: 'Organic Tomatoes',
      quantity: '2 lbs',
      checked: false
    },
    {
      id: 3,
      name: 'Fresh Basil',
      quantity: '1 bunch',
      checked: false
    }
  ],
  'Costco': [
    {
      id: 4,
      name: 'Chicken Breast',
      quantity: 'Family pack',
      checked: false
    },
    {
      id: 5,
      name: 'Eggs',
      quantity: '24 pack',
      checked: false,
      meta: 'Running low'
    }
  ],
  'Whole Foods': [
    {
      id: 6,
      name: 'Oat Milk',
      quantity: '1 carton',
      checked: true
    },
    {
      id: 7,
      name: 'Sourdough Bread',
      quantity: '1 loaf',
      checked: true
    }
  ],
  "Trader Joe's": [
    {
      id: 8,
      name: 'Everything Bagel Seasoning',
      quantity: '1 bottle',
      checked: false
    }
  ]
};

export const mockInventory = [
  {
    id: 1,
    name: 'Chicken Breast',
    category: 'Meat',
    emoji: '🍗',
    quantity: 2,
    unit: 'lbs',
    daysLeft: 5,
    percentage: 80,
    details: ['Fresh', '2 lbs', '5 days left']
  },
  {
    id: 2,
    name: 'Bell Peppers',
    category: 'Vegetables',
    emoji: '🫑',
    quantity: 2,
    unit: 'count',
    daysLeft: 2,
    percentage: 30,
    details: ['⚠️ Use Soon', '2 left', '2 days'],
    expiring: true
  },
  {
    id: 3,
    name: 'Oat Milk',
    category: 'Dairy',
    emoji: '🥛',
    quantity: 0.5,
    unit: 'gallon',
    daysLeft: 7,
    percentage: 60,
    details: ['Dairy', 'Half gallon']
  },
  {
    id: 4,
    name: 'Pasta',
    category: 'Pantry',
    emoji: '🍝',
    quantity: 3,
    unit: 'boxes',
    daysLeft: 365,
    percentage: 100,
    details: ['Pantry', '3 boxes']
  }
];

export const mockRecipes = [
  {
    id: 1,
    title: 'Chicken Stir Fry',
    cuisineTags: ['chinese', 'quick'],
    time: 25,
    difficulty: 'Easy',
    servings: 4,
    ingredients: ['Chicken', 'Bell peppers', 'Onions'],
    missingIngredients: [],
    section: 'expiring',
    ready: true
  },
  {
    id: 2,
    title: 'Stuffed Peppers',
    cuisineTags: ['american'],
    time: 45,
    difficulty: 'Medium',
    servings: 6,
    ingredients: ['Bell peppers', 'Rice'],
    missingIngredients: ['Ground beef'],
    section: 'expiring',
    ready: false
  },
  {
    id: 3,
    title: 'Pasta Carbonara',
    cuisineTags: ['italian', 'quick'],
    time: 20,
    difficulty: 'Easy',
    servings: 4,
    ingredients: ['Pasta', 'Eggs', 'Bacon', 'Parmesan'],
    missingIngredients: [],
    section: 'quick',
    ready: true
  },
  {
    id: 4,
    title: 'Chicken Tacos',
    cuisineTags: ['mexican', 'quick'],
    time: 30,
    difficulty: 'Easy',
    servings: 4,
    ingredients: ['Chicken', 'Peppers'],
    missingIngredients: ['Tortillas', 'Salsa'],
    section: 'quick',
    ready: false
  },
  {
    id: 5,
    title: 'Pad Thai',
    cuisineTags: ['thai'],
    time: 35,
    difficulty: 'Medium',
    servings: 4,
    ingredients: [],
    missingIngredients: ['Rice noodles', 'Tamarind', 'Peanuts'],
    section: 'favorites',
    ready: false
  }
];

export const storeIcons = {
  'Farmers Market': '🥬', // Keep emoji for Farmers Market since no logo available
  'Costco': costcoLogo,
  'Whole Foods': wholefoodsLogo,
  "Trader Joe's": traderjosLogo,
  'Target': targetLogo
};

export const stores = ['Farmers Market', 'Costco', 'Whole Foods', "Trader Joe's", 'Target'];

export const categories = ['All', 'Dairy', 'Fruits', 'Veggies', 'Meat', 'Pantry', 'Frozen'];

export const recipeFilters = [
  'All', 'Ready', 'Favorites', 'Expiring Items', 'Quick Meals',
  'Healthy', 'Comfort Food', 'Italian', 'Chinese', 'Mexican'
];

export const cuisineTagConfig = {
  italian: { emoji: '🍝', label: 'Italian' },
  chinese: { emoji: '🥢', label: 'Chinese' },
  mexican: { emoji: '🌮', label: 'Mexican' },
  thai: { emoji: '🌶️', label: 'Thai' },
  american: { emoji: '🍔', label: 'American' },
  quick: { emoji: '⚡', label: 'Quick' }
};

export const itemSuggestions = [
  { name: 'Milk', emoji: '🥛', hint: 'Running low' },
  { name: 'Bread', emoji: '🍞', hint: 'Frequently bought' },
  { name: 'Eggs', emoji: '🥚', hint: 'Last bought 2 weeks ago' }
];

export const storeSuggestions = [
  { name: 'Farmers Market', emoji: '🥬', hint: 'Produce default' },
  { name: 'Costco', logo: costcoLogo, hint: 'Bulk items' },
  { name: 'Whole Foods', logo: wholefoodsLogo, hint: 'Organic' },
  { name: "Trader Joe's", logo: traderjosLogo, hint: 'Specialty' },
  { name: 'Target', logo: targetLogo, hint: 'Everyday essentials' }
];