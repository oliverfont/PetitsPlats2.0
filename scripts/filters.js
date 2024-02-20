// filters.js

import recipesData from '../data/recipes.js';

console.log(recipesData);

export function filterRecipesBySearchTerm(searchTerm) {
    return recipesData.filter(recipe => {
        // Vérifiez si le terme de recherche correspond au nom de la recette
        if (recipe.name.toLowerCase().includes(searchTerm)) {
            return true;
        }
        // Vérifiez si le terme de recherche correspond à l'un des ingrédients de la recette
        for (const ingredient of recipe.ingredients) {
            if (ingredient.ingredient.toLowerCase().includes(searchTerm)) {
                return true;
            }
        }
        // Vérifiez si le terme de recherche correspond à l'appareil de la recette
        if (recipe.appliance.toLowerCase().includes(searchTerm)) {
            return true;
        }
        // Vérifiez si le terme de recherche correspond à l'un des ustensiles de la recette
        if (recipe.ustensils) {
            for (const ustensil of recipe.ustensils) {
                if (ustensil.toLowerCase().includes(searchTerm)) {
                    return true;
                }
            }
        }
        // Si aucun des critères ci-dessus ne correspond, retournez false
        return false;
    });
}
