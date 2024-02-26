    // Fonction pour mettre à jour les options des dropdowns en fonction des recettes filtrées
    function updateDropdownOptions(recipes) {
        const uniqueIngredients = extractUniqueOptions(recipes, 'ingredients');
        const uniqueAppliances = extractUniqueOptions(recipes, 'appliance');
        const uniqueUtensils = extractUniqueOptions(recipes, 'ustensils');
    
        // Supprimer les anciennes options
        clearDropdownOptions();
    
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


    const ingredientsDropdown = document.getElementById('ingrédients').querySelector('.options');
    const appliancesDropdown = document.getElementById('appareils').querySelector('.options');
    const utensilsDropdown = document.getElementById('ustensiles').querySelector('.options');
    const searchInput = document.querySelector('#search-form input');
    const totalRecipesElement = document.getElementById('total-recipes');

// Fonction pour extraire les options uniques pour chaque type de filtre et les trier par ordre alphabétique
function extractUniqueOptions(recipesData, key) {
    const uniqueOptionsSet = new Set(); // Utilisation d'un ensemble pour stocker les valeurs uniques

    recipesData.forEach(recipe => {
        if (Array.isArray(recipe[key])) {
            recipe[key].forEach(option => {
                if (typeof option === 'object' && 'ingredient' in option) {
                    const normalizedOption = normalizeOption(option.ingredient);
                    uniqueOptionsSet.add(normalizedOption); // Ajouter l'ingrédient normalisé à l'ensemble
                } else {
                    const normalizedOption = normalizeOption(option);
                    uniqueOptionsSet.add(normalizedOption); // Ajouter l'option normalisée directement à l'ensemble
                }
            });
        } else {
            const normalizedOption = normalizeOption(recipe[key]);
            uniqueOptionsSet.add(normalizedOption); // Si ce n'est pas un tableau, ajouter directement l'option normalisée à l'ensemble
        }
    });

    // Fonction pour normaliser une option avec la première lettre en majuscule et le reste en minuscules
function normalizeOption(option) {
    return option.charAt(0).toUpperCase() + option.slice(1).toLowerCase();
}


    // Convertir l'ensemble en tableau tout en conservant l'ordre alphabétique
    const uniqueOptionsArray = Array.from(uniqueOptionsSet).sort((a, b) => a.localeCompare(b));

    return uniqueOptionsArray;
}

// Fonction pour normaliser une option en convertissant en minuscules et en supprimant les espaces inutiles
function normalizeOption(option) {
    return option.toLowerCase().trim();
}
    
    // Fonction pour créer les options de filtre dans les dropdowns
    function createFilterOptions(options, dropdown) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            dropdown.appendChild(optionElement);
        });
    }

    // Mettre à jour les options de filtre initiales
    const uniqueIngredients = extractUniqueOptions(recipesData, 'ingredients');
    const uniqueAppliances = extractUniqueOptions(recipesData, 'appliance');
    const uniqueUtensils = extractUniqueOptions(recipesData, 'ustensils');

    createFilterOptions(uniqueIngredients, ingredientsDropdown);
    createFilterOptions(uniqueAppliances, appliancesDropdown);
    createFilterOptions(uniqueUtensils, utensilsDropdown);

    // Gestionnaire d'événements pour les changements dans les filtres
    [ingredientsDropdown, appliancesDropdown, utensilsDropdown].forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            filterRecipes();
        });
    });

    // Gestionnaire d'événements pour la recherche
    searchInput.addEventListener('input', function() {
        filterRecipes();
    });

    // Fonction pour filtrer les recettes en fonction des options sélectionnées
    function filterRecipes() {
        const selectedIngredients = ingredientsDropdown.value;
        const selectedAppliance = appliancesDropdown.value;
        const selectedUtensil = utensilsDropdown.value;
        const searchTerm = searchInput.value.trim().toLowerCase();

        const filteredRecipes = recipesData.filter(recipe => {
            // Vérifier si le nom de la recette correspond au terme de recherche
            const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
            // Vérifier si l'ingrédient est dans la recette
            const ingredientMatch = selectedIngredients === 'All' || recipe.ingredients.includes(selectedIngredients);
            // Vérifier si l'appareil est dans la recette
            const applianceMatch = selectedAppliance === 'All' || recipe.appliance === selectedAppliance;
            // Vérifier si l'ustensile est dans la recette
            const utensilMatch = selectedUtensil === 'All' || recipe.ustensils.includes(selectedUtensil);

            return nameMatch && ingredientMatch && applianceMatch && utensilMatch;
        });

        // Afficher les recettes filtrées
        displayRecipes(filteredRecipes);
    }

    // Fonction pour afficher les recettes
    function displayRecipes(recipes) {
        // Votre logique pour afficher les recettes
        // Ici, vous devrez implémenter la logique pour afficher les recettes dans la div "recettes-container"
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

