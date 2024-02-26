document.addEventListener('DOMContentLoaded', function() {
    const recipesContainer = document.querySelector('.recettes-container');
    const totalRecipesElement = document.getElementById('total-recipes');
    const searchInput = document.getElementById('search-form').querySelector('input');
    const selectedIngredients = document.getElementById('selectedIngredients');
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

    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        addTagToSelectedIngredients(searchTerm);
        searchInput.value = ''; // Réinitialise l'input de recherche

        // Ajouter le terme de recherche aux filtres
        filters.push(searchTerm.toLowerCase());

        // Filtrer les recettes avec les nouveaux filtres
        applyFilters();
    }
});

// Fonction pour appliquer les filtres aux recettes
function applyFilters() {
    if (filters.length > 0) {
        // Filtrer les recettes correspondant aux filtres
        filteredRecipes = recipesData.filter(recipe => {
            return filters.every(filter => {
                return (
                    recipe.name.toLowerCase().includes(filter) ||
                    recipe.description.toLowerCase().includes(filter) ||
                    recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(filter))
                );
            });
        });
        // Afficher les recettes filtrées
        displayRecipes(filteredRecipes);
    } else {
        // Si aucun filtre n'est défini, afficher toutes les recettes
        displayRecipes(recipesData);
    }
}

// Fonction pour ajouter un tag dans la div selectedIngredients
function addTagToSelectedIngredients(tag) {
    const tagElement = document.createElement('div');
    tagElement.classList.add('selected-option');
    tagElement.textContent = tag;

    // Ajouter un bouton pour supprimer le tag
    const closeButton = document.createElement('span');
    closeButton.textContent = 'x';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', function() {
        tagElement.remove();
        // Retirer le tag des filtres
        const index = filters.indexOf(tag.toLowerCase());
        if (index !== -1) {
            filters.splice(index, 1);
        }
        // Appliquer à nouveau les filtres
        applyFilters();
    });

    tagElement.appendChild(closeButton);
    selectedIngredients.appendChild(tagElement);
}
});
