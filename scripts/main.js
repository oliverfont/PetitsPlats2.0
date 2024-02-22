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

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filteredRecipes = recipesData.filter(recipe => recipeMatchesSearch(recipe, searchTerm));
        displayRecipes(filteredRecipes);
        updateDropdowns(); // Mettre à jour les dropdowns en fonction des recettes filtrées
    }

    function recipeMatchesSearch(recipe, searchTerm) {
        return (
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm))
        );
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm.length >= 3) {
            performSearch();
        } else if (searchTerm.length === 0) {
            displayRecipes(recipesData);
            selectedIngredients.innerHTML = ''; // Effacer les tags lorsque la recherche est vide
        }
    });

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le formulaire de se soumettre
        performSearch();
        updateSelectedIngredients(); // Mettre à jour les tags
    });

    function updateSelectedIngredients() {
        selectedIngredients.innerHTML = '';
        const searchTerms = searchInput.value.trim().split(' ');
        searchTerms.forEach(term => {
            if (term) {
                const tag = document.createElement('span');
                tag.textContent = term;
                tag.classList.add('search-keyword');
                selectedIngredients.appendChild(tag);
    
                // Ajouter la petite croix pour supprimer le tag
                const closeIcon = document.createElement('i');
                closeIcon.classList.add('bi', 'bi-x');
                closeIcon.addEventListener('click', function() {
                    tag.remove(); // Supprimer le tag
                    filters = filters.filter(filter => filter !== term); // Retirer le filtre correspondant
                    performSearch(); // Mettre à jour les résultats de la recherche
                });
                tag.appendChild(closeIcon);
            }
        });
    
        // Réinitialiser la barre de recherche après le submit
        searchInput.value = '';
    }
    
    // Fonction de suppression de filtre
    selectedIngredients.addEventListener('click', function(event) {
        if (event.target.classList.contains('search-keyword')) {
            const termToRemove = event.target.textContent;
            filters = filters.filter(term => term !== termToRemove); // Filtrer le terme à retirer
            event.target.remove(); // Supprimer le tag
            performSearch(); // Effectuer une recherche mise à jour après la suppression du filtre
        }
    });

    displayRecipes(recipesData);

    // Filtres avancé //

    // Fonction pour normaliser les noms d'ingrédients
    function normalizeIngredientName(name) {
        // Convertir en minuscules et supprimer les espaces inutiles
        const lowerCaseName = name.toLowerCase().trim();
        // Supprimer le "s" à la fin si présent (forme plurielle)
        if (lowerCaseName.endsWith('s')) {
            return lowerCaseName.slice(0, -1);
        }
        return lowerCaseName;
    }

    // Fonction pour mettre à jour les dropdowns en fonction des recettes filtrées
    function updateDropdowns() {
        const filteredIngredients = extractUniqueOptions(filteredRecipes, 'ingredients').sort();
        const filteredAppliances = extractUniqueOptions(filteredRecipes, 'appliance').sort();
        const filteredUtensils = extractUniqueOptions(filteredRecipes, 'ustensils').sort();

        updateDropdownOptions(filteredIngredients, ingredientsDropdown);
        updateDropdownOptions(filteredAppliances, appliancesDropdown);
        updateDropdownOptions(filteredUtensils, utensilsDropdown);
    }

    // Fonction pour mettre à jour les options d'un dropdown donné
function updateDropdownOptions(options, dropdownContent) {
    const optionsContainer = dropdownContent.querySelector('.options');
    // Supprimer les anciennes options
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        optionsContainer.appendChild(optionElement);

        // Ajouter un écouteur d'événements pour gérer la sélection d'une option
        optionElement.addEventListener('click', function() {
            const selectedOption = this.textContent;
            addTag(selectedOption);
        });
    });
}


    // Fonction pour extraire les options uniques
    function extractUniqueOptions(recipesData, key) {
        const uniqueOptions = new Set();

        recipesData.forEach(recipe => {
            if (Array.isArray(recipe[key])) {
                recipe[key].forEach(option => {
                    if (typeof option === 'object') {
                        uniqueOptions.add(normalizeIngredientName(option.ingredient));
                    } else {
                        uniqueOptions.add(normalizeIngredientName(option));
                    }
                });
            } else {
                uniqueOptions.add(normalizeIngredientName(recipe[key]));
            }
        });

        return Array.from(uniqueOptions).sort();
    }    

    // Fonction pour créer les options de chaque dropdown
    function createDropdownOptions(options, dropdownContent) {
        const optionsContainer = dropdownContent.querySelector('.options');

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionsContainer.appendChild(optionElement);

            // Ajouter un écouteur d'événements pour gérer la sélection d'une option
            optionElement.addEventListener('click', function() {
                const selectedOption = this.textContent;
                addTag(selectedOption);
            });
        });
    }

    // Fonction pour ajouter un tag correspondant à l'option sélectionnée
    function addTag(selectedOption) {
        // Récupérer le conteneur des tags
        const selectedIngredients = document.getElementById('selectedIngredients');

        // Créer un élément span pour afficher l'option sélectionnée
        const span = document.createElement('span');
        span.textContent = selectedOption;

        // Ajouter la classe pour le style CSS si nécessaire
        span.classList.add('selected-option');

        // Créer un élément pour la croix de suppression
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('bi', 'bi-x');

        // Ajouter un écouteur d'événements pour la suppression de l'élément
        closeIcon.addEventListener('click', function() {
            span.remove(); // Supprimer l'élément span lors du clic sur la croix
        });

        // Ajouter la croix à l'élément span
        span.appendChild(closeIcon);

        // Ajouter l'élément span au conteneur spécifique
        selectedIngredients.appendChild(span);
    }

    // Fonction pour gérer l'ouverture et la fermeture des dropdowns
    function setupDropdowns(dropdownClass) {
        const dropbtns = document.querySelectorAll(`.${dropdownClass} .dropbtn`);
        const filterInputs = document.querySelectorAll(`.${dropdownClass} .filterInput`);

        dropbtns.forEach(dropbtn => {
            dropbtn.addEventListener('click', function() {
                const dropdownContent = this.nextElementSibling;
                dropdownContent.classList.toggle("show");
            });
        });

        filterInputs.forEach(input => {
            input.addEventListener('input', function() {
                const filter = this.value.toUpperCase();
                const dropdownContent = this.parentElement;
                const items = dropdownContent.querySelectorAll(".options option");

                items.forEach(item => {
                    let txtValue = item.textContent || item.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        item.style.display = "";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    // Sélection des conteneurs dropdown pour chaque type d'option
    const ingredientsDropdown = document.querySelector('.ingredients .myDropdown');
    const appliancesDropdown = document.querySelector('.appliances .myDropdown');
    const utensilsDropdown = document.querySelector('.utensils .myDropdown');

    // Extraire les options uniques pour chaque type
    const uniqueIngredients = extractUniqueOptions(recipesData, 'ingredients').sort();
    const uniqueAppliances = extractUniqueOptions(recipesData, 'appliance').sort();
    const uniqueUtensils = extractUniqueOptions(recipesData, 'ustensils').sort();

    // Créer les options pour chaque dropdown
    createDropdownOptions(uniqueIngredients, ingredientsDropdown);
    createDropdownOptions(uniqueAppliances, appliancesDropdown);
    createDropdownOptions(uniqueUtensils, utensilsDropdown);

    // Appeler la fonction setupDropdowns pour chaque dropdown
    setupDropdowns('dropdown');
});
