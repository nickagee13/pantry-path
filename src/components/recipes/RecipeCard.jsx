import { Clock, Users, ChefHat } from 'lucide-react';
import { cuisineTagConfig } from '../../data/mockData';

const RecipeCard = ({ recipe, onClick }) => {
  const getBadgeClass = () => {
    return recipe.ready ? 'recipe-badge' : 'recipe-badge missing';
  };

  const getBadgeText = () => {
    if (recipe.ready) return 'Ready';
    const missingCount = recipe.missingIngredients.length;
    return missingCount === 1 ? '1 Missing' : `${missingCount} Missing`;
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

  const renderIngredients = () => {
    if (recipe.missingIngredients.length > 0) {
      return (
        <div className="recipe-ingredients">
          Missing: {recipe.missingIngredients.join(', ')}
          {recipe.ingredients.length > 0 && ` • Uses: ${recipe.ingredients.join(', ')}`}
        </div>
      );
    }
    return (
      <div className="recipe-ingredients">
        Uses: {recipe.ingredients.join(', ')}
      </div>
    );
  };

  return (
    <div className="recipe-card" onClick={() => onClick && onClick(recipe)}>
      <div className="recipe-header">
        <div className="recipe-title">{recipe.title}</div>
        <div className={getBadgeClass()}>{getBadgeText()}</div>
      </div>

      <div className="recipe-tags">
        {renderCuisineTags()}
      </div>

      <div className="recipe-info">
        <span><Clock size={12} /> {recipe.time} min</span>
        <span><ChefHat size={12} /> {recipe.difficulty}</span>
        <span><Users size={12} /> {recipe.servings} servings</span>
      </div>

      {renderIngredients()}
    </div>
  );
};

export default RecipeCard;