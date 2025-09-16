import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Header from '../common/Header';
import FilterPills from '../common/FilterPills';
import RecipeCard from '../recipes/RecipeCard';
import RecipeDetailModal from '../recipes/RecipeDetailModal';
import { recipeFilters } from '../../data/mockData';
import { RECIPE_SECTIONS, RECIPE_SECTION_TITLES } from '../../utils/constants';

const RecipesView = ({ recipes, onAddMissingToList, onMarkAsCooked, initialFilter = 'All' }) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  const handleAddMissingToList = (missingIngredients) => {
    if (onAddMissingToList) {
      onAddMissingToList(missingIngredients);
    }
    // Close modal after adding items
    setModalOpen(false);
  };

  const filterRecipes = (recipeList) => {
    if (activeFilter === 'All') return recipeList;

    switch (activeFilter) {
      case 'Ready':
        return recipeList.filter(r => r.ready === true);
      case 'Favorites':
        return recipeList.filter(r => r.section === RECIPE_SECTIONS.FAVORITES);
      case 'Expiring Items':
        return recipeList.filter(r => r.section === RECIPE_SECTIONS.EXPIRING);
      case 'Quick Meals':
        return recipeList.filter(r => r.section === RECIPE_SECTIONS.QUICK);
      case 'Italian':
        return recipeList.filter(r => r.cuisineTags.includes('italian'));
      case 'Chinese':
        return recipeList.filter(r => r.cuisineTags.includes('chinese'));
      case 'Mexican':
        return recipeList.filter(r => r.cuisineTags.includes('mexican'));
      default:
        return recipeList;
    }
  };

  const groupRecipesBySection = (recipeList) => {
    if (activeFilter !== 'All') {
      return { [activeFilter]: recipeList };
    }

    const sections = {
      [RECIPE_SECTIONS.EXPIRING]: [],
      [RECIPE_SECTIONS.QUICK]: [],
      [RECIPE_SECTIONS.FAVORITES]: []
    };

    recipeList.forEach(recipe => {
      if (sections[recipe.section]) {
        sections[recipe.section].push(recipe);
      }
    });

    return sections;
  };

  const filteredRecipes = filterRecipes(recipes);
  const groupedRecipes = groupRecipesBySection(filteredRecipes);

  const headerActions = (
    <button className="icon-btn">
      <Sparkles size={16} />
    </button>
  );

  return (
    <div className="view active">
      <Header
        title="Recipes"
        subtitle="Based on your inventory"
        actions={headerActions}
      />

      <FilterPills
        filters={recipeFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="recipe-grid">
        {Object.entries(groupedRecipes).map(([section, sectionRecipes]) => {
          if (sectionRecipes.length === 0) return null;

          const sectionTitle = RECIPE_SECTION_TITLES[section] || section;

          return (
            <div key={section} className="recipe-section">
              <div className="section-title">{sectionTitle}</div>
              {sectionRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={handleRecipeClick}
                />
              ))}
            </div>
          );
        })}
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddMissingToList={handleAddMissingToList}
        onMarkAsCooked={onMarkAsCooked}
      />
    </div>
  );
};

export default RecipesView;