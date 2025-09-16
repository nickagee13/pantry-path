import { useState } from 'react';
import { ArrowLeft, Clock, Users, ChefHat, ShoppingCart } from 'lucide-react';
import { cuisineTagConfig } from '../../data/mockData';

const RecipeDetailModal = ({ recipe, isOpen, onClose, onAddMissingToList, onMarkAsCooked }) => {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [servings, setServings] = useState(recipe?.servings || 4);

  if (!isOpen || !recipe) return null;

  const toggleIngredient = (ingredient) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedIngredients(newChecked);
  };

  const handleAddMissingToList = () => {
    if (onAddMissingToList && recipe.missingIngredients.length > 0) {
      onAddMissingToList(recipe.missingIngredients);
    }
  };

  const renderCuisineTags = () => {
    return recipe.cuisineTags.map((tag, index) => {
      const config = cuisineTagConfig[tag];
      if (!config) return null;

      return (
        <span key={index} className={`cuisine-tag ${tag}`}>
          {config.emoji} {config.label}
        </span>
      );
    });
  };

  // Mock ingredient quantities - in a real app, this would come from the recipe data
  const getIngredientQuantities = () => {
    const baseQuantities = {
      'Chicken': '1 lb',
      'Bell peppers': '2 cups',
      'Onions': '1 medium',
      'Rice': '2 cups',
      'Pasta': '12 oz',
      'Eggs': '4 large',
      'Bacon': '6 strips',
      'Parmesan': '1/2 cup',
      'Ground beef': '1 lb',
      'Tortillas': '8 count',
      'Salsa': '1 cup',
      'Rice noodles': '8 oz',
      'Tamarind': '2 tbsp',
      'Peanuts': '1/4 cup'
    };

    // Adjust quantities based on servings
    const ratio = servings / (recipe?.servings || 4);
    const adjustedQuantities = {};

    Object.keys(baseQuantities).forEach(ingredient => {
      const baseQty = baseQuantities[ingredient];
      // For simplicity, just multiply numeric values
      const match = baseQty.match(/(\d+(?:\.\d+)?)\s*(.*)/);
      if (match) {
        const amount = parseFloat(match[1]) * ratio;
        const unit = match[2];
        adjustedQuantities[ingredient] = `${amount % 1 === 0 ? amount : amount.toFixed(1)} ${unit}`;
      } else {
        adjustedQuantities[ingredient] = baseQty;
      }
    });

    return adjustedQuantities;
  };

  const ingredientQuantities = getIngredientQuantities();

  // Mock recipe instructions - in a real app, this would come from the recipe data
  const mockInstructions = [
    "Heat oil in a large skillet or wok over medium-high heat.",
    "Add chicken and cook until golden brown and cooked through, about 5-7 minutes.",
    "Add bell peppers and onions, stir-fry for 3-4 minutes until crisp-tender.",
    "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
    "Add sauce mixture and toss everything together until well coated.",
    "Cook for another 1-2 minutes until sauce thickens slightly.",
    "Serve immediately over rice or noodles."
  ];

  const handleMarkAsCooked = () => {
    if (onMarkAsCooked) {
      onMarkAsCooked(recipe, servings);
    }
    onClose();
  };

  return (
    <div className="recipe-detail-view">
      <div className="recipe-detail-content">
        {/* Header */}
        <div className="recipe-modal-header">
          <div className="recipe-header-top">
            <button className="recipe-modal-close" onClick={onClose}>
              <ArrowLeft size={24} />
            </button>
            <button className="mark-cooked-btn" onClick={handleMarkAsCooked}>
              Mark as Cooked
            </button>
          </div>
          <h1 className="recipe-modal-title">{recipe.title}</h1>

          <div className="recipe-modal-tags">
            {renderCuisineTags()}
          </div>

          <div className="recipe-modal-info">
            <div className="recipe-info-item">
              <Clock size={16} />
              <span>{recipe.time} min</span>
            </div>
            <div className="recipe-info-item">
              <ChefHat size={16} />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="recipe-info-item">
              <Users size={16} />
              <div className="servings-control">
                <button
                  className="servings-btn"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                >
                  -
                </button>
                <span>{servings} servings</span>
                <button
                  className="servings-btn"
                  onClick={() => setServings(servings + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="recipe-modal-body">
          {/* Ingredients Section */}
          <div className="recipe-section">
            <h2 className="recipe-section-title">Ingredients</h2>

            {recipe.missingIngredients.length > 0 && (
              <div className="missing-ingredients-banner">
                <div className="missing-text">
                  Missing {recipe.missingIngredients.length} ingredient{recipe.missingIngredients.length !== 1 ? 's' : ''}
                </div>
                <button className="add-missing-btn" onClick={handleAddMissingToList}>
                  <ShoppingCart size={16} />
                  Add to List
                </button>
              </div>
            )}

            <div className="ingredients-list">
              {/* Available ingredients */}
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={`available-${index}`}
                  className="ingredient-item available"
                >
                  <span className="ingredient-text">
                    {ingredient}
                    <span className="ingredient-quantity">
                      {ingredientQuantities[ingredient] || '1 unit'}
                    </span>
                  </span>
                  <span className="ingredient-status">✓ Available</span>
                </div>
              ))}

              {/* Missing ingredients */}
              {recipe.missingIngredients.map((ingredient, index) => (
                <div
                  key={`missing-${index}`}
                  className="ingredient-item missing"
                >
                  <span className="ingredient-text">
                    {ingredient}
                    <span className="ingredient-quantity">
                      {ingredientQuantities[ingredient] || '1 unit'}
                    </span>
                  </span>
                  <span className="ingredient-status">✗ Missing</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="recipe-section">
            <h2 className="recipe-section-title">Instructions</h2>
            <div className="instructions-list">
              {mockInstructions.map((instruction, index) => (
                <div key={index} className="instruction-item">
                  <div className="instruction-number">{index + 1}</div>
                  <div className="instruction-text">{instruction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;