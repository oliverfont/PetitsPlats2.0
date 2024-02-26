// Variables globales pour stocker les filtres d'ingrédients, d'appareils et d'ustensiles
let ingredientFilters = [];
let applianceFilters = [];
let utensilFilters = [];


document.addEventListener('DOMContentLoaded', function() {
    
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
                const link = document.createElement('option');
                link.href = '#'; // Vous pouvez définir un lien approprié ici si nécessaire
                link.textContent = option;
                optionsContainer.appendChild(link);
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
    
        // Appeler la fonction setupDropdowns pour chaque dropdown
        setupDropdowns('dropdown');

        // Fonction pour gérer les sélections d'options dans les dropdowns
function setupDropdownSelections(dropdownClass) {
    const dropdowns = document.querySelectorAll(`.${dropdownClass}`);

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const selectedOptions = Array.from(this.selectedOptions).map(option => option.textContent);
            const filterType = dropdown.dataset.filterType; // Récupérer le type de filtre
            updateFilters(filterType, selectedOptions);
        });
    });
}

// Fonction pour mettre à jour les filtres en fonction des options sélectionnées
function updateFilters(filterType, selectedOptions) {
    // Mettre à jour les filtres en conséquence du type de filtre
    switch (filterType) {
        case 'ingredients':
            // Mettre à jour les filtres d'ingrédients
            ingredientFilters = selectedOptions;
            break;
        case 'appliances':
            // Mettre à jour les filtres d'appareils
            applianceFilters = selectedOptions;
            break;
        case 'utensils':
            // Mettre à jour les filtres d'ustensiles
            utensilFilters = selectedOptions;
            break;
        default:
            break;
    }

    // Appliquer les filtres et afficher les recettes filtrées
    applyFilters();
}

// Appeler la fonction setupDropdownSelections pour chaque dropdown
setupDropdownSelections('myDropdown');

// Fonction pour appliquer les filtres et afficher les recettes filtrées
function applyFilters() {
    // Filtrer les recettes en fonction des filtres sélectionnés
    const filteredRecipes = recipesData.filter(recipe => {
        // Vérifier si chaque filtre est présent dans la recette
        const passesIngredientFilter = ingredientFilters.every(filter => {
            return recipe.ingredients.some(ingredient => normalizeIngredientName(ingredient.ingredient) === filter);
        });
        const passesApplianceFilter = applianceFilters.includes(recipe.appliance.toLowerCase());
        const passesUtensilFilter = utensilFilters.every(filter => recipe.ustensils.some(utensil => normalizeIngredientName(utensil) === filter));

        // Retourner true si la recette passe tous les filtres
        return passesIngredientFilter && passesApplianceFilter && passesUtensilFilter;
    });

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);
}



    });
    