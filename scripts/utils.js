// utils.js

import { filterByIngredient, filterByAppliance, filterByUstensil } from './filters.js';

export function displayRecipes(recipes) {
    const recipesContainer = document.querySelector('.recettes-container');

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

export function updateTotalRecipesDisplayed() {
    const totalRecipesElement = document.getElementById('total-recipes');
    const recipesContainer = document.querySelector('.recettes-container');
    const totalRecipesDisplayed = recipesContainer.childElementCount;
    totalRecipesElement.textContent = totalRecipesDisplayed + ' recettes';
}

export function updateAdvancedSearchFields(filteredRecipes) {
    // Récupérez les sélecteurs appropriés
    const ingredientsSelect = document.getElementById('ingrédients');
    const appareilsSelect = document.getElementById('appareils');
    const ustensilesSelect = document.getElementById('ustensiles');

    // Réinitialiser les champs de recherche avancée
    resetAdvancedSearchFields();

    // Créer des ensembles pour stocker les valeurs uniques d'ingrédients, d'appareils et d'ustensiles
    const allIngredients = new Set();
    const allAppareils = new Set();
    const allUstensiles = new Set();

    // Parcourir toutes les recettes pour extraire les valeurs uniques d'ingrédients, d'appareils et d'ustensiles
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => allIngredients.add(ingredient.ingredient));
        allAppareils.add(recipe.appliance);
        if (recipe.ustensils) {
            recipe.ustensils.forEach(ustensil => allUstensiles.add(ustensil));
        }
    });

    // Mettre à jour les options des champs de recherche avancée avec toutes les valeurs possibles
    allIngredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient;
        option.textContent = ingredient;
        ingredientsSelect.appendChild(option);
    });

    allAppareils.forEach(appareil => {
        const option = document.createElement('option');
        option.value = appareil;
        option.textContent = appareil;
        appareilsSelect.appendChild(option);
    });

    allUstensiles.forEach(ustensil => {
        const option = document.createElement('option');
        option.value = ustensil;
        option.textContent = ustensil;
        ustensilesSelect.appendChild(option);
    });
}

function resetAdvancedSearchFields() {
    // Réinitialiser les options des champs de recherche avancée
    const ingredientsSelect = document.getElementById('ingrédients');
    const appareilsSelect = document.getElementById('appareils');
    const ustensilesSelect = document.getElementById('ustensiles');

    ingredientsSelect.innerHTML = '<option value="ingrédients" disabled selected>Ingrédients</option>';
    appareilsSelect.innerHTML = '<option value="appareils" disabled selected>Appareils</option>';
    ustensilesSelect.innerHTML = '<option value="ustensiles" disabled selected>Ustensiles</option>';
}
