import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './App.css';

import { VIEWS } from './utils/constants';
import { mockGroceryList, mockInventory, mockRecipes } from './data/mockData';

import BottomNav from './components/common/BottomNav';
import GroceryListView from './components/views/GroceryListView';
import InventoryView from './components/views/InventoryView';
import RecipesView from './components/views/RecipesView';
import AddItemView from './components/views/AddItemView';
import SettingsView from './components/views/SettingsView';
import Notification from './components/common/Notification';

function App() {
  const [activeView, setActiveView] = useState(VIEWS.GROCERY);
  const [shoppingMode, setShoppingMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [groceryList, setGroceryList] = useState(mockGroceryList);
  const [inventory, setInventory] = useState(mockInventory);
  const [recipes] = useState(mockRecipes);
  const [storeOrder, setStoreOrder] = useState(Object.keys(mockGroceryList));
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

  const toggleItemCheck = (storeKey, itemId) => {
    setGroceryList(prev => ({
      ...prev,
      [storeKey]: prev[storeKey].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const removeFromInventory = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const updateInventoryItem = (updatedItem) => {
    setInventory(prev => prev.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ));
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

  const addNewItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      name: itemData.name,
      quantity: itemData.quantity || '1',
      checked: false
    };

    const store = itemData.store || 'Farmers Market';
    setGroceryList(prev => ({
      ...prev,
      [store]: [...(prev[store] || []), newItem]
    }));
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

  const handleReorderStores = (newOrder) => {
    setStoreOrder(newOrder);
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
          onUpdateItem={updateInventoryItem}
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

export default App;