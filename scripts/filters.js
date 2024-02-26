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

// Fonction pour extraire les options uniques pour chaque type de filtre et les trier par ordre alphabétique
function extractUniqueOptions(recipesData, key) {
    const uniqueOptionsSet = new Set(); // Utilisation d'un ensemble pour stocker les valeurs uniques

    recipesData.forEach(recipe => {
        if (Array.isArray(recipe[key])) {
            recipe[key].forEach(option => {
                uniqueOptionsSet.add(option); // Ajouter l'option à l'ensemble
            });
        } else {
            uniqueOptionsSet.add(recipe[key]); // Si ce n'est pas un tableau, ajouter directement l'option à l'ensemble
        }
    });

    // Convertir l'ensemble en tableau tout en conservant l'ordre alphabétique
    const uniqueOptionsArray = Array.from(uniqueOptionsSet).sort((a, b) => a.localeCompare(b));

    return uniqueOptionsArray;
}

// Fonction pour créer les options de filtre dans les dropdowns
function createFilterOptions(options, dropdown) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

// Appeler la fonction setupDropdowns pour chaque dropdown
setupDropdowns('dropdown');

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

    // Mettre à jour les options des dropdowns en fonction des recettes filtrées
    updateDropdownOptions(filteredRecipes);

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
    const myDropdowns = document.querySelectorAll(`.${dropdownClass}`);

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

    document.addEventListener('click', function(event) {
        myDropdowns.forEach(dropdown => {
            const dropbtn = dropdown.previousElementSibling; // Le bouton qui ouvre le dropdown
            if (event.target !== dropbtn && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
}
}

// Mettre à jour les options de filtre initiales
let recipesData = []; // Assurez-vous que recipesData est correctement défini

// Vous devrez remplacer la valeur de recipesData par votre propre ensemble de données de recettes

const uniqueIngredients = extractUniqueOptions(recipesData, 'ingredients');
const uniqueAppliances = extractUniqueOptions(recipesData, 'appliance');
const uniqueUtensils = extractUniqueOptions(recipesData, 'ustensils');

createFilterOptions(uniqueIngredients, ingredientsDropdown);
createFilterOptions(uniqueAppliances, appliancesDropdown);
createFilterOptions(uniqueUtensils, utensilsDropdown);
