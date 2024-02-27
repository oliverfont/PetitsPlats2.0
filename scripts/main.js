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
        recipesContainer.innerHTML = ''; // Vide le conteneur des recettes actuelles
        let displayedRecipesCount = 0;

        // Parcours de toutes les recettes et création des éléments HTML correspondants
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
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
                            ${
                                (function() {
                                    let ingredientsHTML = '';
                                    for (let j = 0; j < recipe.ingredients.length; j++) {
                                        const ingredient = recipe.ingredients[j];
                                        ingredientsHTML += `
                                            <li>
                                                <p class="ingredient">${ingredient.ingredient}</p>
                                                <p class="quantity">${ingredient.quantity !== undefined ? ingredient.quantity : '&nbsp;' }${ingredient.quantity !== undefined && ingredient.unit ? ' ' + ingredient.unit : ''}</p>
                                            </li>
                                        `;
                                    }
                                    return ingredientsHTML;
                                })()
                            }
                        </ul>
                    </div>
                </div>
                <div class="time">${recipe.time}min</div>
            `;
            recipesContainer.appendChild(article);
            displayedRecipesCount++;
        }

        // Mise à jour du nombre total de recettes affichées
        totalRecipesElement.textContent = displayedRecipesCount + ' recettes';
    }

    // Afficher toutes les recettes au chargement de la page
    displayRecipes(recipesData);

    // Gestionnaire d'événements pour la saisie dans la barre de recherche principale
    searchInput.addEventListener('input', function(event) {
        console.log('Saisie dans la barre de recherche principale détectée.');
        const searchTerm = event.target.value.trim().toLowerCase();

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
        const searchTerm = searchInput.value.trim(); // Récupère la valeur de l'input
        addTagToSelectedOptions(searchTerm); // Ajoute le terme de recherche comme tag
        searchInput.value = ''; // Efface le contenu de l'input après avoir ajouté le tag
        filterRecipes(); // Filtrer les recettes par les options sélectionnées
    });

    // Fonction pour filtrer les recettes en fonction des tags sélectionnés et de la recherche principale
    function filterRecipes() {
        console.log('Filtrage des recettes en cours.');
        const selectedTags = [];
        const selectedOptionTags = document.querySelectorAll('.selected-option');
        for (let i = 0; i < selectedOptionTags.length; i++) {
            selectedTags.push(selectedOptionTags[i].textContent.trim().toLowerCase());
        }
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Filtrer les recettes par les options sélectionnées dans les tags et la recherche principale
        filteredRecipes = [];
        for (let i = 0; i < recipesData.length; i++) {
            const recipe = recipesData[i];
            // Vérifier si la recette correspond à la recherche principale
            const searchMatch = (
                recipe.name.toLowerCase().includes(searchTerm) || // Vérifier le nom de la recette
                recipe.description.toLowerCase().includes(searchTerm) || // Vérifier la description de la recette
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm)) || // Vérifier les ingrédients
                recipe.appliance.toLowerCase().includes(searchTerm) || // Vérifier l'appareil
                recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(searchTerm)) // Vérifier les ustensiles
            );

            // Vérifier si la recette correspond à tous les tags sélectionnés
            const tagMatch = selectedTags.every(tag =>
                recipe.name.toLowerCase().includes(tag) ||
                recipe.description.toLowerCase().includes(tag) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(tag)) ||
                recipe.appliance.toLowerCase().includes(tag) ||
                recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(tag))
            );

            if (searchMatch && tagMatch) {
                filteredRecipes.push(recipe);
            }
        }

        // Afficher les recettes filtrées
        console.log('Recettes filtrées :', filteredRecipes);
        displayRecipes(filteredRecipes);
        
        // Mettre à jour les options des dropdowns en fonction des recettes filtrées
        updateDropdownOptions(filteredRecipes);
    }

    // Fonction pour extraire les options uniques d'une clé donnée (ingrédients, appareils, ustensiles)
    function extractUniqueOptions(recipesData, key) {
        const uniqueOptionsSet = new Set(); // Utilisation d'un ensemble pour stocker les valeurs uniques

        for (let i = 0; i < recipesData.length; i++) {
            const recipe = recipesData[i];
            if (Array.isArray(recipe[key])) {
                for (let j = 0; j < recipe[key].length; j++) {
                    const option = recipe[key][j];
                    if (typeof option === 'object' && 'ingredient' in option) {
                        uniqueOptionsSet.add(normalizeOption(option.ingredient)); // Ajouter l'ingrédient normalisé à l'ensemble
                    } else {
                        uniqueOptionsSet.add(normalizeOption(option)); // Ajouter l'option normalisée directement à l'ensemble
                    }
                }
            } else if (recipe[key]) {
                uniqueOptionsSet.add(normalizeOption(recipe[key])); // Si ce n'est pas un tableau, ajouter directement l'option normalisée à l'ensemble
            }
        }

        // Convertir l'ensemble en tableau tout en conservant l'ordre alphabétique
        return Array.from(uniqueOptionsSet).sort((a, b) => a.localeCompare(b));
    }

    // Fonction pour mettre à jour les options des dropdowns en fonction des recettes filtrées
    function updateDropdownOptions(recipes) {
        const uniqueIngredients = extractUniqueOptions(recipes, 'ingredients');
        const uniqueAppliances = extractUniqueOptions(recipes, 'appliance');
        const uniqueUtensils = extractUniqueOptions(recipes, 'ustensils');

        clearDropdownOptions(); // Supprimer les anciennes options

        // Créer les nouvelles options
        createFilterOptions(uniqueIngredients, ingredientsDropdown);
        createFilterOptions(uniqueAppliances, appliancesDropdown);
        createFilterOptions(uniqueUtensils, utensilsDropdown);
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
    const dropdowns = [ingredientsDropdown, appliancesDropdown, utensilsDropdown];
    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener('change', function() {
            filterRecipes();
        });
    }

    // Fonction pour créer les options de filtre dans les dropdowns
    function createFilterOptions(options, dropdown) {
        for (let i = 0; i < options.length; i++) {
            const optionElement = document.createElement('option');
            optionElement.textContent = options[i];
            dropdown.appendChild(optionElement);

            // Ajouter un gestionnaire d'événements pour déclencher filterRecipes() lorsqu'une option est ajoutée
            optionElement.addEventListener('click', function() {
                const tagText = optionElement.textContent.trim(); // Récupère le texte de l'option
                addTagToSelectedOptions(tagText); // Ajoute le texte de l'option comme tag
                filterRecipes(); // Filtrer les recettes par les options sélectionnées
            });
        }
    }

    // Fonction pour normaliser une option en convertissant en minuscules et en supprimant les espaces inutiles
    function normalizeOption(option) {
        return option.toLowerCase().trim();
    }

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

    // Fonction pour ajouter un tag dans la div selectedOptions
    function addTagToSelectedOptions(tagText) {
        // Vérifier si le tag n'est pas déjà présent
        if (!isTagAlreadySelected(tagText)) {
            const tagElement = document.createElement('div');
            tagElement.classList.add('selected-option');
            tagElement.textContent = tagText;

            // Gestionnaire d'événements pour supprimer le tag
            tagElement.addEventListener('click', function() {
                tagElement.remove(); // Supprimer le tag de l'interface utilisateur
                removeFilter(tagText); // Retirer le filtre associé
                filterRecipes(); // Filtrer les recettes à nouveau après la suppression du tag
                updateDropdownOptions(filteredRecipes); // Mettre à jour les options des dropdowns
            });

            // Ajouter le tag à la liste des tags sélectionnés
            selectedOptions.appendChild(tagElement);

            // Mettre à jour les filtres et filtrer les recettes
            updateFilters();
        }
    }

    // Fonction pour vérifier si un tag est déjà sélectionné
    function isTagAlreadySelected(tagText) {
        const existingTags = document.querySelectorAll('.selected-option');
        for (let i = 0; i < existingTags.length; i++) {
            if (existingTags[i].textContent.trim().toLowerCase() === tagText.toLowerCase().trim()) {
                return true;
            }
        }
        return false;
    }

    // Fonction pour mettre à jour les filtres et filtrer les recettes
    function updateFilters() {
        filters = [];
        const selectedOptionTags = document.querySelectorAll('.selected-option');
        for (let i = 0; i < selectedOptionTags.length; i++) {
            filters.push(selectedOptionTags[i].textContent.trim().toLowerCase());
        }
        filterRecipes();
    }

// Gestionnaire d'événements pour les options de filtre
const options = document.querySelectorAll('.options option');
for (let i = 0; i < options.length; i++) {
    const option = options[i];
    option.addEventListener('click', function(event) {
        event.stopPropagation(); // Arrête la propagation de l'événement pour éviter les déclenchements multiples
        const tagText = option.textContent.trim(); // Récupère le texte de l'option
        addTagToSelectedOptions(tagText); // Ajoute le texte de l'option comme tag
        filterRecipes(); // Filtrer les recettes par les options sélectionnées
        updateDropdownOptions(filteredRecipes); // Mettre à jour les options des dropdowns
    });
}

// Fonction pour gérer l'ouverture et la fermeture des dropdowns
function setupDropdowns(dropdownClass) {
    const dropbtns = document.querySelectorAll(`.${dropdownClass} .dropbtn`);
    const filterInputs = document.querySelectorAll(`.${dropdownClass} .filterInput`);

    // Parcours des dropbtns
    for (let i = 0; i < dropbtns.length; i++) {
        const dropbtn = dropbtns[i];
        dropbtn.addEventListener('click', function() {
            const dropdownContent = this.nextElementSibling;
            dropdownContent.classList.toggle("show");
        });
    }

    // Parcours des filterInputs
    for (let i = 0; i < filterInputs.length; i++) {
        const input = filterInputs[i];
        input.addEventListener('input', function() {
            const filter = this.value.toUpperCase();
            const dropdownContent = this.parentElement;
            const items = dropdownContent.querySelectorAll(".options option");

            // Parcours des items
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                let txtValue = item.textContent || item.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            }
        });
    }
}

// Gestionnaire d'événements pour la fermeture des dropdowns lorsqu'on clique à l'extérieur
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.myDropdown');
    
    // Parcours des dropdowns
    for (let i = 0; i < dropdowns.length; i++) {
        const dropdown = dropdowns[i];
        const dropbtn = dropdown.previousElementSibling; // Le bouton qui ouvre le dropdown
        if (event.target !== dropbtn && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    }
});

// Appeler la fonction setupDropdowns pour chaque dropdown
setupDropdowns('dropdown');
});