import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './App.css';

import { VIEWS } from './utils/constants';
import { mockGroceryList, mockInventory, mockRecipes } from './data/mockData';
import { useGroceryList, useStores, useInventory } from './hooks/useSupabase';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthView from './components/auth/AuthView';
import BottomNav from './components/common/BottomNav';
import GroceryListView from './components/views/GroceryListView';
import InventoryView from './components/views/InventoryView';
import RecipesView from './components/views/RecipesView';
import AddItemView from './components/views/AddItemView';
import SettingsView from './components/views/SettingsView';
import Notification from './components/common/Notification';

const AuthenticatedApp = () => {
  const [activeView, setActiveView] = useState(VIEWS.GROCERY);
  const [shoppingMode, setShoppingMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Real Supabase data
  const { groceryList, addGroceryItem, updateGroceryItem, deleteGroceryItem, loading: groceryLoading } = useGroceryList();
  const { stores, updateStoreOrder, loading: storesLoading } = useStores();
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, loading: inventoryLoading } = useInventory();

  // Keep using mock data for now (we'll convert recipes later)
  const [recipes] = useState(mockRecipes);

  const storeOrder = stores.map(store => store.name);
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false, showUndo: false, undoAction: null });
  const [recipeFilter, setRecipeFilter] = useState('All');
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (shoppingMode) {
      document.body.classList.add('shopping-mode');
    } else {
      document.body.classList.remove('shopping-mode');
    }
  }, [shoppingMode]);

  const toggleItemCheck = async (storeKey, itemId) => {
    // Find the item in our current grocery list
    const storeItems = groceryList[storeKey] || [];
    const item = storeItems.find(item => item.id === itemId);

    if (item) {
      const newCheckedState = !item.checked;

      try {
        // Update the grocery item
        await updateGroceryItem(itemId, { checked: newCheckedState });

        // If item is being checked, add to inventory
        if (newCheckedState) {
          const inventoryItem = createInventoryItemFromGrocery(item);
          await addInventoryItem(inventoryItem);

          showNotification(`${item.name} added to kitchen inventory! 🍽️`, 'success');
        }
      } catch (error) {
        console.error('Error updating grocery item:', error);
        showNotification('Error updating item', 'error');
      }
    }
  };

  const createInventoryItemFromGrocery = (groceryItem) => {
    // Map grocery item to inventory item with appropriate category and defaults
    const categoryMapping = {
      'milk': 'Dairy',
      'cheese': 'Dairy',
      'yogurt': 'Dairy',
      'apple': 'Fruits',
      'banana': 'Fruits',
      'orange': 'Fruits',
      'chicken': 'Meat',
      'beef': 'Meat',
      'fish': 'Meat',
      'bread': 'Pantry',
      'rice': 'Pantry',
      'pasta': 'Pantry'
    };

    const itemName = groceryItem.name.toLowerCase();
    let category = 'Pantry'; // default
    let emoji = '📦'; // default
    let location = 'Pantry'; // default

    // Simple keyword matching for category
    for (const [keyword, cat] of Object.entries(categoryMapping)) {
      if (itemName.includes(keyword)) {
        category = cat;
        break;
      }
    }

    // Set location based on category
    if (category === 'Dairy' || category === 'Meat') {
      location = 'Fridge';
    } else if (category === 'Frozen') {
      location = 'Freezer';
    }

    // Set emoji based on category
    const emojiMapping = {
      'Dairy': '🥛',
      'Fruits': '🍎',
      'Vegetables': '🥬',
      'Meat': '🍗',
      'Pantry': '📦',
      'Frozen': '🧊'
    };
    emoji = emojiMapping[category] || '📦';

    return {
      name: groceryItem.name,
      category: category,
      location: location,
      emoji: emoji,
      quantity: parseFloat(groceryItem.quantity) || 1,
      unit: 'count',
      expires_at: category === 'Fruits' || category === 'Vegetables' || category === 'Dairy' || category === 'Meat'
        ? new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days from now
        : null,
      percentage: 100,
      details: ['Fresh', groceryItem.quantity || '1'],
      running_low: false
    };
  };

  const removeFromInventory = async (itemId) => {
    await deleteInventoryItem(itemId);
    showNotification('Item removed from inventory', 'success');
  };

  const updateInventoryItemLocal = async (updatedItem) => {
    await updateInventoryItem(updatedItem.id, updatedItem);
  };

  const addToGroceryList = (item) => {
    const defaultStore = 'Farmers Market';
    const newItem = {
      id: Date.now(),
      name: item.name,
      quantity: '1',
      checked: false
    };

    setGroceryList(prev => ({
      ...prev,
      [defaultStore]: [...(prev[defaultStore] || []), newItem]
    }));
  };

  const addNewItem = async (itemData) => {
    const store = itemData.store || 'Farmers Market';
    const newItem = {
      name: itemData.name,
      quantity: itemData.quantity || '1',
      addedBy: itemData.addedBy
    };

    await addGroceryItem(store, newItem);
  };

  const addMissingIngredientsToList = (ingredients) => {
    const defaultStore = 'Farmers Market';
    const newItems = ingredients.map(ingredient => ({
      id: Date.now() + Math.random(),
      name: ingredient,
      quantity: '1',
      checked: false
    }));

    setGroceryList(prev => ({
      ...prev,
      [defaultStore]: [...(prev[defaultStore] || []), ...newItems]
    }));
  };

  const markRecipeAsCooked = (recipe, servings) => {
    // Calculate ingredient usage based on servings ratio
    const servingsRatio = servings / recipe.servings;

    // Deplete inventory ingredients based on recipe usage
    setInventory(prev => prev.map(item => {
      const isIngredientInRecipe = recipe.ingredients.some(ingredient =>
        ingredient.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(ingredient.toLowerCase())
      );

      if (isIngredientInRecipe) {
        // Reduce by estimated usage (20% per serving as baseline)
        const usagePercentage = Math.min(20 * servingsRatio, item.percentage);
        return {
          ...item,
          percentage: Math.max(0, item.percentage - usagePercentage)
        };
      }
      return item;
    }));
  };

  const getStats = () => {
    const totalItems = Object.values(groceryList).flat().filter(item => !item.checked).length;
    const expiringItems = inventory.filter(item => item.daysLeft <= 2).length;
    const canMakeRecipes = recipes.filter(recipe => recipe.ready).length;

    return {
      list: totalItems,
      expiring: expiringItems,
      canMake: canMakeRecipes
    };
  };

  const handleFabClick = () => {
    setActiveView(VIEWS.ADD);
  };

  const handleNavigateToExpiring = () => {
    setActiveView(VIEWS.INVENTORY);
    // TODO: Set expiring filter state
  };

  const handleNavigateToRecipes = () => {
    setActiveView(VIEWS.RECIPES);
    setRecipeFilter('Ready');
  };

  const handleReorderStores = async (newOrder) => {
    await updateStoreOrder(newOrder);
  };

  const showNotification = (message, type, undoAction = null) => {
    setNotification({
      message,
      type,
      isVisible: true,
      showUndo: !!undoAction,
      undoAction
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleUndo = () => {
    if (notification.undoAction) {
      notification.undoAction();
      hideNotification();
    }
  };

  return (
    <div className="container">
      {activeView === VIEWS.GROCERY && (
        <GroceryListView
          groceryList={groceryList}
          shoppingMode={shoppingMode}
          onToggleShoppingMode={() => setShoppingMode(!shoppingMode)}
          onToggleCheck={toggleItemCheck}
          stats={getStats()}
          onNavigateToExpiring={handleNavigateToExpiring}
          onNavigateToRecipes={handleNavigateToRecipes}
          onReorderStores={handleReorderStores}
          storeOrder={storeOrder}
        />
      )}

      {activeView === VIEWS.INVENTORY && (
        <InventoryView
          inventory={inventory}
          onRemoveItem={removeFromInventory}
          onAddToList={addToGroceryList}
          onUpdateItem={updateInventoryItemLocal}
          onShowNotification={showNotification}
        />
      )}

      {activeView === VIEWS.RECIPES && (
        <RecipesView
          recipes={recipes}
          onAddMissingToList={addMissingIngredientsToList}
          onMarkAsCooked={markRecipeAsCooked}
          initialFilter={recipeFilter}
        />
      )}

      {activeView === VIEWS.ADD && (
        <AddItemView
          onAddItem={addNewItem}
          onNavigateBack={() => setActiveView(VIEWS.GROCERY)}
        />
      )}

      {activeView === VIEWS.SETTINGS && (
        <SettingsView
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          storeOrder={storeOrder}
          onReorderStores={handleReorderStores}
        />
      )}

      <button className="fab" onClick={handleFabClick}>
        <span className="fab-icon">+</span>
      </button>

      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        showUndo={notification.showUndo}
        onClose={hideNotification}
        onUndo={handleUndo}
      />
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  )
}

const AppWithAuth = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-container">
        <div style={{ textAlign: 'center' }}>
          <h1>🛒 PantryPath</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthView />
  }

  return <AuthenticatedApp />
}

export default App;