export const VIEWS = {
  GROCERY: 'grocery-view',
  INVENTORY: 'inventory-view',
  RECIPES: 'recipes-view',
  ADD: 'add-view',
  SETTINGS: 'settings-view'
};

export const ANIMATION_DURATION = 300;

export const STATS_CONFIG = {
  LIST: {
    label: 'List',
    desc: 'To buy',
    icon: '📝',
    className: ''
  },
  EXPIRING: {
    label: 'Expiring',
    desc: 'Use soon',
    icon: '⏰',
    className: 'blue'
  },
  CAN_MAKE: {
    label: 'Can Make',
    desc: 'Recipes',
    icon: '🍳',
    className: 'green'
  }
};

export const RECIPE_SECTIONS = {
  EXPIRING: 'expiring',
  QUICK: 'quick',
  FAVORITES: 'favorites'
};

export const RECIPE_SECTION_TITLES = {
  [RECIPE_SECTIONS.EXPIRING]: '🔥 Use Soon - Expiring Items',
  [RECIPE_SECTIONS.QUICK]: '✨ Quick Meals',
  [RECIPE_SECTIONS.FAVORITES]: '🌟 Favorites'
};

export const SETTINGS_SECTIONS = {
  APPEARANCE: 'Appearance',
  STORES: 'Your Stores',
  NOTIFICATIONS: 'Notifications',
  FAMILY: 'Family Sharing'
};

export const NOTIFICATION_SETTINGS = [
  {
    id: 'expiration',
    title: 'Expiration Alerts',
    description: '2 days before items expire',
    active: true
  },
  {
    id: 'lowStock',
    title: 'Low Stock Alerts',
    description: 'When items drop below 25%',
    active: true
  },
  {
    id: 'recipes',
    title: 'Recipe Suggestions',
    description: 'Daily meal ideas',
    active: false
  }
];

export const FAMILY_MEMBERS = [
  {
    id: 'nick',
    name: 'Nick',
    initial: 'N',
    gradient: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
    permissions: 'Owner',
    status: 'Active'
  },
  {
    id: 'elsie',
    name: 'Elsie',
    initial: 'E',
    gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    permissions: 'Can edit',
    status: 'Active'
  }
];

export const STORE_CATEGORIES = {
  'Farmers Market': 'Produce, Herbs',
  'Costco': 'Bulk, Meat',
  'Whole Foods': 'Organic, Dairy',
  "Trader Joe's": 'Snacks, Specialty',
  'Target': 'Everyday essentials'
};