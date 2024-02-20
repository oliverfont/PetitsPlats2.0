// app.js
import { filterByIngredient, filterByAppliance, filterByUstensil } from '/scripts/filters.js';
import { displayRecipes, updateTotalRecipesDisplayed, updateAdvancedSearchFields, filterRecipesBySearchTerm } from './recipes.js';

export function initializeApp() {
    const searchForm = document.querySelector('.form-inline');

    // Ajoutez un écouteur d'événements pour le formulaire de recherche
    searchForm.addEventListener('submit', function(event) {
        // Empêchez le formulaire de se soumettre de manière traditionnelle
        event.preventDefault();

        // Récupérez la valeur de recherche de l'entrée de formulaire
        const searchInput = document.querySelector('.form-control');
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Filtrer les recettes en fonction de la valeur de recherche
        const filteredRecipes = filterRecipesBySearchTerm(searchTerm);

        // Afficher les recettes filtrées
        displayRecipes(filteredRecipes);

        // Actualiser les champs de recherche avancée avec les informations des recettes filtrées
        updateAdvancedSearchFields(filteredRecipes);
    });

    const recipesContainer = document.querySelector('.recettes-container');
    let filteredRecipes = recipesData.slice(); // Copie des recettes originales

    // Mettre à jour le nombre total de recettes affichées
    function updateTotalRecipesDisplayed() {
        const totalRecipesElement = document.getElementById('total-recipes');
        const totalRecipesDisplayed = recipesContainer.childElementCount;
        totalRecipesElement.textContent = totalRecipesDisplayed + ' recettes';
    }

    // Parcours les données et crée les éléments HTML pour chaque recette
    function displayRecipes(recipes) {
        // Vide le contenu actuel du conteneur des recettes
        recipesContainer.innerHTML = '';

        // Parcours les recettes et crée les éléments HTML pour chaque recette
        recipes.forEach(recipe => {
            const article = document.createElement('article');
            article.classList.add('recipe');
            article.setAttribute('data-id', recipe.id);
            article.innerHTML = `
                <img class="imgCard" src="assets/ImagesPlats/${recipe.image}" alt="${recipe.name}">
                <div class="infoCard">
                    <h2>${recipe.name}</h2>
                    <h3>RECETTE</h3>
                    <p class="description">${recipe.description}</p>
                    <div class="ingredients">
                        <h3>INGREDIENTS</h3>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `
                                <li>
                                    <p class="ingredient">${ingredient.ingredient}</p>
                                    <p class="quantity">${ingredient.quantity !== undefined ? ingredient.quantity : '&nbsp;' }${ingredient.quantity !== undefined && ingredient.unit ? ' ' + ingredient.unit : ''}</p>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="time">${recipe.time}min</div>
            `;
            recipesContainer.appendChild(article);
        });

        // Mettre à jour le nombre total de recettes affichées
        updateTotalRecipesDisplayed();
    }

    // Récupérez les sélecteurs appropriés
    const ingredientsSelect = document.getElementById('ingrédients');
    const appareilsSelect = document.getElementById('appareils');
    const ustensilesSelect = document.getElementById('ustensiles');

    // Fonction pour mettre à jour les champs de recherche avancée avec les informations des recettes filtrées
    function updateAdvancedSearchFields(filteredRecipes) {
        // Réinitialiser les champs de recherche avancée
        resetAdvancedSearchFields();

        // Créer des ensembles pour stocker les valeurs uniques d'ingrédients, d'appareils et d'ustensiles des recettes filtrées
        const uniqueFilteredIngredients = new Set();
        const uniqueFilteredAppareils = new Set();
        const uniqueFilteredUstensiles = new Set();

        // Parcourir les recettes filtrées pour extraire les valeurs uniques d'ingrédients, d'appareils et d'ustensiles
        filteredRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                uniqueFilteredIngredients.add(ingredient.ingredient);
            });

            uniqueFilteredAppareils.add(recipe.appliance);

            if (recipe.ustensils) {
                recipe.ustensils.forEach(ustensil => {
                    uniqueFilteredUstensiles.add(ustensil);
                });
            }
        });

        // Mettre à jour les options des champs de recherche avancée avec les valeurs uniques des recettes filtrées
        uniqueFilteredIngredients.forEach(ingredient => {
            const option = document.createElement('option');
            option.value = ingredient;
            option.textContent = ingredient;
            ingredientsSelect.appendChild(option);
        });

        uniqueFilteredAppareils.forEach(appareil => {
            const option = document.createElement('option');
            option.value = appareil;
            option.textContent = appareil;
            appareilsSelect.appendChild(option);
        });

        uniqueFilteredUstensiles.forEach(ustensil => {
            const option = document.createElement('option');
            option.value = ustensil;
            option.textContent = ustensil;
            ustensilesSelect.appendChild(option);
        });
    }

    // Fonction pour réinitialiser les champs de recherche avancée
    function resetAdvancedSearchFields() {
        // Réinitialiser les options des champs de recherche avancée
        ingredientsSelect.innerHTML = '<option value="ingrédients" disabled selected>Ingrédients</option>';
        appareilsSelect.innerHTML = '<option value="appareils" disabled selected>Appareils</option>';
        ustensilesSelect.innerHTML = '<option value="ustensiles" disabled selected>Ustensiles</option>';
    }

    // Initialiser les champs de recherche avancée
    resetAdvancedSearchFields();

    // Fonction de filtrage par terme de recherche
    function filterRecipesBySearchTerm(searchTerm) {
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

    function filterRecipes() {
        let ingredientFiltered = filterByIngredient(ingredientsSelect.value.toLowerCase(), recipesData.slice());
        let applianceFiltered = filterByAppliance(appareilsSelect.value.toLowerCase(), recipesData.slice());
        let ustensilFiltered = filterByUstensil(ustensilesSelect.value.toLowerCase(), recipesData.slice());

        // Intersection des résultats des trois filtres
        filteredRecipes = ingredientFiltered.filter(recipe =>
            applianceFiltered.includes(recipe) && ustensilFiltered.includes(recipe)
        );

        // Affichez les recettes filtrées
        displayRecipes(filteredRecipes);

        // Actualiser les champs de recherche avancée avec les informations des recettes filtrées
        updateAdvancedSearchFields(filteredRecipes);
    }

    // Ajoutez des écouteurs d'événements pour les sélecteurs de filtres
    ingredientsSelect.addEventListener('change', filterRecipes);
    appareilsSelect.addEventListener('change', filterRecipes);
    ustensilesSelect.addEventListener('change', filterRecipes);

    // Afficher toutes les recettes au chargement de la page
    displayRecipes(recipesData);

    // Récupérez l'élément de la barre de recherche principale
    const searchInput = document.querySelector('.form-control');

    // Ajoutez un gestionnaire d'événements pour la saisie dans la barre de recherche principale
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm.length >= 3 || searchTerm.length === 0) {
            const filteredRecipes = filterRecipesBySearchTerm(searchTerm);
            displayRecipes(filteredRecipes);
            updateAdvancedSearchFields(filteredRecipes);
        }
    });
}
