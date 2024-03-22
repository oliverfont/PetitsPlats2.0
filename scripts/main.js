// Sélection des éléments du DOM
const recipesContainer = document.querySelector('.recettes-container');
const totalRecipesElement = document.getElementById('total-recipes');
const searchInput = document.getElementById('search-form').querySelector('input');
const selectedOptions = document.getElementById('selectedOption');

let filteredRecipes = []; // Stockage des recettes filtrées

// Événement déclenché lorsque le contenu de la page est entièrement chargé
document.addEventListener('DOMContentLoaded', function() {

    // Fonction pour afficher les recettes dans le conteneur
    function displayRecipes(recipes) {
        recipesContainer.innerHTML = ''; // Vide le conteneur des recettes
        let displayedRecipesCount = 0;

        // Parcours de toutes les recettes et création des éléments HTML correspondants
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
                // Si aucune recette n'est affichée :
        if (displayedRecipesCount === 0) {
            recipesContainer.innerHTML = `
            <p>Aucune recette ne contient '${sanitizeInput(searchInput.value.trim().toLowerCase())}', vous pouvez chercher 'tarte aux pommes', 'poisson', etc.</p>
        `;
        totalRecipesElement.textContent = '0 recette'
        } else {
            // Mise à jour du nombre total de recettes affichées
            totalRecipesElement.textContent = displayedRecipesCount + ' recettes';
        }
    }

    // Afficher toutes les recettes au chargement de la page
    displayRecipes(recipesData);

    // Gestionnaire d'événements pour la saisie dans la barre de recherche principale
    searchInput.addEventListener('input', function(event) {
        console.log('Saisie dans la barre de recherche principale détectée.');
        const searchTerm = sanitizeInput(event.target.value.trim().toLowerCase());
        if (searchTerm.length >= 3) {
            console.log('Longueur de la recherche suffisante. Appel de filterRecipes().');
            filterRecipes(); // Appel de la fonction pour filtrer les recettes
        } else {
            console.log('La longueur de la recherche est inférieure à 3 caractères. Affichage de toutes les recettes.');
            displayRecipes(recipesData); // Afficher toutes les recettes si la recherche est trop courte
        }
    });

    // Gestionnaire d'événements pour le formulaire de recherche
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire
        console.log('Soumission du formulaire de recherche détectée.');
        const searchTerm = sanitizeInput(searchInput.value.trim().toLowerCase());
        addTagToSelectedOptions(searchTerm); // Ajoute le terme de recherche comme tag
        searchInput.value = ''; // Efface le contenu de l'input après avoir ajouté le tag
        filterRecipes(); // Filtrer les recettes par les options sélectionnées
    });

// Fonction pour nettoyer la saisie et éviter les injections de scripts ou de balises HTML
function sanitizeInput(input) {
    if ((input === null) || (input === '')) {
        return '';
    } else {
        return input.toString().replace(/(<([^>]+)>)/ig, ''); // Supprime les balises HTML
    }
}

// Fonction pour normaliser une chaîne de caractères
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Fonction pour filtrer les recettes en fonction des tags sélectionnés et de la recherche principale
function filterRecipes() {
    const selectedTags = Array.from(document.querySelectorAll('.selected-option'), tag => normalizeString(tag.textContent));
    const searchTerm = normalizeString(searchInput.value);

    // Filtrer les recettes par les options sélectionnées dans les tags et la recherche principale
    filteredRecipes = recipesData.filter(recipe => {
        const searchMatch = (
            normalizeString(recipe.name).includes(searchTerm) ||
            normalizeString(recipe.description).includes(searchTerm) ||
            recipe.ingredients.some(ingredient => normalizeString(ingredient.ingredient).includes(searchTerm)) ||
            normalizeString(recipe.appliance).includes(searchTerm) ||
            recipe.ustensils.some(ustensil => normalizeString(ustensil).includes(searchTerm))
        );

        const tagMatch = selectedTags.every(tag =>
            normalizeString(recipe.name).includes(tag) ||
            normalizeString(recipe.description).includes(tag) ||
            recipe.ingredients.some(ingredient => normalizeString(ingredient.ingredient).includes(tag)) ||
            normalizeString(recipe.appliance).includes(tag) ||
            recipe.ustensils.some(ustensil => normalizeString(ustensil).includes(tag))
        );

        return searchMatch && tagMatch;
    });

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
    // Mettre à jour les options des dropdowns en fonction des recettes filtrées
    updateDropdownOptions(filteredRecipes);
}

    // Fonction pour extraire les options uniques d'une clé donnée (ingrédients, appareils, ustensiles)
    function extractUniqueOptions(recipesData, key) {
        const uniqueOptionsSet = new Set(); // Utilisation d'un ensemble pour stocker les valeurs uniques

        if (recipesData && Array.isArray(recipesData)) {
            recipesData.forEach(recipe => {
                if (recipe && Array.isArray(recipe[key])) {
                    recipe[key].forEach(option => {
                        if (option && typeof option === 'object' && 'ingredient' in option) {
                            const normalizedOption = normalizeOption(option.ingredient);
                            uniqueOptionsSet.add(normalizedOption); 
                        } else if (option) {
                            const normalizedOption = normalizeOption(option);
                            uniqueOptionsSet.add(normalizedOption); 
                        }
                    });
                } else if (recipe && recipe[key]) {
                    const normalizedOption = normalizeOption(recipe[key]);
                    uniqueOptionsSet.add(normalizedOption); 
                }
            });
        }

        // Convertir l'ensemble en tableau tout en conservant l'ordre alphabétique
        const uniqueOptionsArray = Array.from(uniqueOptionsSet).sort((a, b) => a.localeCompare(b));

        return uniqueOptionsArray;
    }
    
    function updateDropdownOptions(recipes) {
        const uniqueIngredients = extractUniqueOptions(recipes, 'ingredients');
        const uniqueAppliances = extractUniqueOptions(recipes, 'appliance');
        const uniqueUtensils = extractUniqueOptions(recipes, 'ustensils');
    
        clearDropdownOptions(); // Supprimer les anciennes options
    
        // Créer les nouvelles options
        createFilterOptions(uniqueIngredients, ingredientsDropdown);
        createFilterOptions(uniqueAppliances, appliancesDropdown);
        createFilterOptions(uniqueUtensils, utensilsDropdown);
    
        // Appliquer la classe 'selected' aux options déjà sélectionnées
        const selectedOptionTags = document.querySelectorAll('.selected-option');
        selectedOptionTags.forEach(tag => {
            const tagText = tag.textContent.trim().toLowerCase();
            const optionElements = document.querySelectorAll('.options option');
            optionElements.forEach(option => {
                if (option.textContent.trim().toLowerCase() === tagText) {
                    option.classList.add('selected');
                }
            });
        });
    }
    

    // Fonction pour vider les options actuelles des dropdowns
    function clearDropdownOptions() {
        ingredientsDropdown.innerHTML = ''; // Vide les options de l'élément dropdown pour les ingrédients
        appliancesDropdown.innerHTML = ''; // Vide les options de l'élément dropdown pour les appareils
        utensilsDropdown.innerHTML = ''; // Vide les options de l'élément dropdown pour les ustensiles
    }

    // Initialisation des éléments dropdown
    const ingredientsDropdown = document.getElementById('ingrédients').querySelector('.options');
    const appliancesDropdown = document.getElementById('appareils').querySelector('.options');
    const utensilsDropdown = document.getElementById('ustensiles').querySelector('.options');

    // Gestionnaire d'événements pour les changements dans les filtres
    [ingredientsDropdown, appliancesDropdown, utensilsDropdown].forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            filterRecipes();
        });
    });

    // Fonction pour créer les options de filtre dans les dropdowns
    function createFilterOptions(options, dropdown) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            dropdown.appendChild(optionElement);

            // Ajouter un gestionnaire d'événements pour déclencher filterRecipes() lorsqu'une option est ajoutée
            optionElement.addEventListener('click', function() {
                const tagText = optionElement.textContent.trim(); // Récupère le texte de l'option
                addTagToSelectedOptions(tagText); // Ajoute le texte de l'option comme tag
                filterRecipes(); // Filtrer les recettes par les options sélectionnées
            });
        });
    }

    // Fonction pour normaliser une option en convertissant en minuscules
    function normalizeOption(option) {
        return option.toLowerCase().trim();
    }

    // Gestionnaire d'événements pour les options de filtre
    document.querySelectorAll('.options option').forEach(option => {
        option.addEventListener('click', function() {
            const tagText = option.textContent.trim(); // Récupère le texte de l'option
            addTagToSelectedOptions(tagText); // Ajoute le texte de l'option comme tag
            filterRecipes(); // Filtrer les recettes par les options sélectionnées
            updateDropdownOptions(filteredRecipes); // Mettre à jour les options des dropdowns
        });
    });

    // Appel initial pour mettre à jour les options des dropdowns
    updateDropdownOptions(recipesData);

    // Déclaration de la variable filters pour stocker les filtres actifs
    let filters = [];

    // Fonction pour supprimer un filtre de la liste des filtres actifs
    function removeFilter(filterValue) {
        // Retirez le filtre des options sélectionnées
        const index = filters.indexOf(filterValue);
        if (index !== -1) {
            filters.splice(index, 1);
        }
    }

    function addTagToSelectedOptions(tagText) {
        if (!isTagAlreadySelected(tagText)) {
            const tagElement = document.createElement('div');
            tagElement.classList.add('selected-option');
            tagElement.textContent = tagText;
    
            // Pour supprimer le tag
            tagElement.addEventListener('click', function() {
                tagElement.remove();
                removeFilter(tagText);
                filterRecipes();
                updateDropdownOptions(filteredRecipes);
                // Désélectionner l'option correspondante dans les dropdowns
                const optionElements = document.querySelectorAll('.options option');
                optionElements.forEach(option => {
                    if (option.textContent.trim().toLowerCase() === tagText.toLowerCase().trim()) {
                        option.classList.remove('selected');
                    }
                });
            });
    
            selectedOptions.appendChild(tagElement);
            updateFilters();
    
            // Sélectionner l'option correspondante dans les dropdowns
            const optionElements = document.querySelectorAll('.options option');
            optionElements.forEach(option => {
                if (option.textContent.trim().toLowerCase() === tagText.toLowerCase().trim()) {
                    option.classList.add('selected');
                }
            });
        }
    }
    

// Fonction pour vérifier si un tag est déjà sélectionné
function isTagAlreadySelected(tagText) {
    const existingTags = Array.from(document.querySelectorAll('.selected-option')).map(tag => tag.textContent.trim().toLowerCase());
    return existingTags.includes(tagText.toLowerCase().trim());
}

    // Fonction pour mettre à jour les filtres et filtrer les recettes
    function updateFilters() {
        filters = Array.from(document.querySelectorAll('.selected-option')).map(tag => tag.textContent.trim().toLowerCase());
        filterRecipes();
    }

    // Gestionnaire d'événements pour les options de filtre
    document.querySelectorAll('.options option').forEach(option => {
        option.addEventListener('click', function() {
            const tagText = option.textContent.trim(); // Récupère le texte de l'option
            addTagToSelectedOptions(tagText); // Ajoute le texte de l'option comme tag
        });
    });

// Gestionnaire d'événements pour les options de filtre
document.querySelectorAll('.options option').forEach(option => {
    option.addEventListener('click', function(event) {
        event.stopPropagation(); // Arrête la propagation de l'événement pour éviter les déclenchements multiples
        const tagText = option.textContent.trim(); // Récupère le texte de l'option
        addTagToSelectedOptions(tagText); // Ajoute le texte de l'option comme tag
        filterRecipes(); // Filtrer les recettes par les options sélectionnées
        updateDropdownOptions(filteredRecipes); // Mettre à jour les options des dropdowns
    });
});


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
            const filter = normalizeString(this.value); // Normaliser la valeur de l'input
            const dropdownContent = this.parentElement;
            const items = dropdownContent.querySelectorAll(".options option");

            items.forEach(item => {
                let txtValue = normalizeString(item.textContent || item.innerText); // Normaliser le texte de l'option
                if (txtValue.indexOf(filter) > -1) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
}

    // Gestionnaire d'événements pour la fermeture des dropdowns lorsqu'on clique à l'extérieur
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('.myDropdown');
        dropdowns.forEach(dropdown => {
            const dropbtn = dropdown.previousElementSibling; // Le bouton qui ouvre le dropdown
            if (event.target !== dropbtn && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    });

    // Appeler la fonction setupDropdowns pour chaque dropdown
    setupDropdowns('dropdown');

});
