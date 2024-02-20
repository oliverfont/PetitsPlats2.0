// main.js

import { displayRecipes, updateTotalRecipesDisplayed, updateAdvancedSearchFields } from './utils.js';
import { filterRecipesBySearchTerm } from './filters.js';

document.addEventListener('DOMContentLoaded', function() {

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
    
});
