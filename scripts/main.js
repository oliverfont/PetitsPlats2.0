document.addEventListener('DOMContentLoaded', function() {
    const recipesContainer = document.querySelector('.recettes-container');
    const totalRecipesElement = document.getElementById('total-recipes');
    const searchInput = document.getElementById('search-form').querySelector('input');
    const selectedIngredients = document.getElementById('selectedOption');

    let filters = []; // Stockage des filtres
    let filteredRecipes = []; // Stockage des recettes filtrées

    function displayRecipes(recipes) {
        recipesContainer.innerHTML = '';
        let displayedRecipesCount = 0;
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
            displayedRecipesCount++;
        });
        totalRecipesElement.textContent = displayedRecipesCount + ' recettes';
    }

    // Afficher toutes les recettes au chargement de la page
    displayRecipes(recipesData);

    // Gestionnaire d'événements pour la saisie dans la barre de recherche principale
    searchInput.addEventListener('input', function(event) {
        const searchTerm = event.target.value.trim().toLowerCase();

        // Vérifier si la longueur de la recherche est supérieure ou égale à 3 caractères
        if (searchTerm.length >= 3) {
            // Filtrer les recettes correspondant à l'entrée de l'utilisateur
            filteredRecipes = recipesData.filter(recipe => {
                return (
                    recipe.name.toLowerCase().includes(searchTerm) ||
                    recipe.description.toLowerCase().includes(searchTerm) ||
                    recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm))
                );
            });
            // Afficher les recettes filtrées
            displayRecipes(filteredRecipes);
        } else {
            // Si la longueur de la recherche est inférieure à 3 caractères, afficher toutes les recettes
            displayRecipes(recipesData);
        }
    });

    // Gestionnaire d'événements pour le formulaire de recherche
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire
        const searchTerm = searchInput.value.trim(); // Récupère la valeur de l'input
        addTagToSelectedIngredients(searchTerm); // Ajoute le terme de recherche comme tag
        searchInput.value = ''; // Efface le contenu de l'input après avoir ajouté le tag
        filterRecipesBySelectedOptions(); // Filtrer les recettes par les options sélectionnées
    });

    // Fonction pour ajouter un tag dans la div selectedIngredients
    function addTagToSelectedIngredients(tagText) {
        const tagElement = document.createElement('div');
        tagElement.classList.add('selected-option');
        tagElement.textContent = tagText;

        // Gestionnaire d'événements pour supprimer le tag
        tagElement.addEventListener('click', function() {
            tagElement.remove(); // Supprimer le tag de l'interface utilisateur
            filterRecipesBySelectedOptions(); // Filtrer les recettes à nouveau après la suppression du tag
        });

        // Ajouter le tag à la liste des tags sélectionnés
        selectedIngredients.appendChild(tagElement);
    }

// Gestionnaire d'événements pour supprimer un tag
document.querySelectorAll('.selected-option').forEach(tagElement => {
    tagElement.addEventListener('click', function() {
        removeTag(tagElement);
    });
});

// Fonction pour supprimer un tag
function removeTag(tagElement) {
    const tagText = tagElement.textContent.trim().toLowerCase();
    tagElement.remove();
    removeFilter(tagText); // Retirer le filtre associé
    filterRecipesBySelectedOptions(); // Filtrer les recettes à nouveau après la suppression du tag
}

// Fonction pour retirer le filtre associé des filtres utilisés pour filtrer les recettes
function removeFilter(filterValue) {
    // Retirez le filtre des options sélectionnées
    const index = filters.indexOf(filterValue);
    if (index !== -1) {
        filters.splice(index, 1);
    }
}

// Fonction pour filtrer les recettes en fonction des options sélectionnées dans les tags et de la barre de recherche principale
function filterRecipesBySelectedOptions() {
    const selectedOptions = Array.from(document.querySelectorAll('.selected-option')).map(option => option.textContent.trim().toLowerCase());
    const searchTerm = searchInput.value.trim().toLowerCase();

    // Filtrer les recettes par les options sélectionnées dans les tags
    filteredRecipes = recipesData.filter(recipe => {
        const nameMatch = selectedOptions.every(option => {
            return recipe.name.toLowerCase().includes(option);
        });

        const ingredientsMatch = selectedOptions.every(option => {
            return recipe.ingredients.some(ingredient => {
                return ingredient.ingredient.toLowerCase().includes(option);
            });
        });

        const descriptionMatch = selectedOptions.every(option => {
            return recipe.description.toLowerCase().includes(option);
        });

        return nameMatch || ingredientsMatch || descriptionMatch;
    });

    // Filtrer les recettes par la barre de recherche principale
    filteredRecipes = filteredRecipes.filter(recipe => {
        return (
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm))
        );
    });

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
}
});
