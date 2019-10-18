// function to prevent page reload and empty #search-results
const clearSearchResults = () => {
  event.preventDefault();
  $('#search-results').empty();
};

// function to clear global counters
const resetGlobalCounters = () => {
  recipeArr = [];
  currentRecipe = '';
  currentSearchTerm = '';
  requestOffset = 0;
  requestLimit = MAX_REQUEST_LIMIT;
  requestFilter = '';

  unsplashImageArr = [];
};

/**
 * formats the string by replacing spaces with commas and a plus
 * @param {string} input the string to be formatted
 */
const formatInputIngredients = input => {
  return input.replace(/ /g, ',+');
};

/**
 * function to render the search bar in the modal
 * @param {string} placeholderTxt the placeholder text to be appended to the searchbar
 * @param {string} disclaimerTxt the disclaimer text appended to the body of the modal
 * @param {number} num a number indicating which function to call when search is clicked
 */
const renderSearchBar = (placeholderTxt, disclaimerTxt, num) => {
  // create elements
  const divGroup = $('<div>', { class: 'input-group' });
  const searchBar = $('<input>', { class: 'form-control', id: 'custom-search', type: 'text', placeholder: placeholderTxt });
  const divInput = $('<div>', { class: 'input-group-append' });
  const searchButton = $('<button>', { class: 'btn btn-primary', id: 'custom-search-button', type: 'button' }).text('Search');
  const disclaimer = $('<p>', { class: 'text-muted font-italic mx-2 mt-3 mb-1' }).text(disclaimerTxt);

  // append elements
  $('.modal-body').append(divGroup);
  divGroup.append(searchBar, divInput, disclaimer);
  divInput.append(searchButton);

  // attach click listener
  $('#custom-search-button').click(() => {
    // switch statement to check which case the load button will do when clicked
    switch (num) {
      case 0:
        getInputFromModal(0);
        break;
      case 1:
        getInputFromModal(1);
        break;
    }
  });
};

/**
 * function to render the nutritional values
 * @param {string} amount the name and amount of the nutrient
 * @param {string} percent the percentage of the nutrient's daily values
 */
const renderNutritionRow = (amount, percent) => {
  const tr = $('<tr>');
  const amt = $('<th>', { scope: 'row' }).text(amount);
  const perc = $('<th>', { scope: 'row' }).text(percent);

  $('#nutrition-table').append(tr);
  tr.append(amt, perc);
};

// function to render the table and append it to the modal
const renderNutritionTable = () => {
  const table = $('<table>', { class: 'table bg-white mb-0' });
  const thead = $('<thead>');
  const tr = $('<tr>');
  const thAmount = $('<th>', { class: 'font-weight-bold text-primary', scope: 'col' }).text('Amount');
  const thPercent = $('<th>', { class: 'font-weight-bold text-primary', scope: 'col' }).text('% Daily Value');

  const tbody = $('<tbody>', { id: 'nutrition-table' });

  $('.modal-body').append(table);
  table.append(thead, tbody);
  thead.append(tr);
  tr.append(thAmount, thPercent);
};

/**
 * function to parse the nutritional information from the recipe and render it
 * into the modal
 * @param {object} recipe the response object containing the recipe information
 */
const parseNutritionInfo = recipe => {
  renderNutritionTable();
  recipe.nutrition.nutrients.forEach(element => {
    const nutritionAmount = element.title + ' ' + element.amount + ' ' + element.unit;
    const nutritionPercent = element.percentOfDailyNeeds + '%';
    renderNutritionRow(nutritionAmount, nutritionPercent);
  });
};

// function to handle clicks on the modal to show/hide it
const clickModal = () => {
  // Get the modal
  const modal = document.getElementById('modal');

  // when the user clicks the close button in the modal, close modal
  $('#modal-button').click(() => {
    $('#modal').remove();
  });

  // when the user clicks anywhere outside of the modal, close modal
  window.onclick = e => {
    if (e.target == modal) {
      $('#modal').remove();
    }
  };
};

/**
 * function to render the modal
 * @param {string} title the title of the modal
 * @param {string} message the message of the modal
 * @param {number} z the z-index of the modal
 */
const renderModal = (title, message = '', z = zIndex) => {
  const modalFade = $('<div>', { id: 'modal' }).css('z-index', z);
  const modalDiaglogue = $('<div>', { class: 'modal-dialog' });
  const modalContent = $('<div>', { class: 'modal-content' });
  const modalHeader = $('<div>', { class: 'modal-header' });
  const modalTitle = $('<h5>', { class: 'modal-title' }).text(title);
  const modalBody = $('<div>', { class: 'modal-body' }).text(message);
  const modalFooter = $('<div>', { class: 'modal-footer' });
  const button = $('<button>', { class: 'btn btn-primary', id: 'modal-button' }).text('Close');

  $('#search-results').prepend(modalFade);
  modalFade.append(modalDiaglogue);
  modalDiaglogue.append(modalContent);
  modalContent.append(modalHeader, modalBody, modalFooter);
  modalHeader.append(modalTitle);
  modalFooter.append(button);

  // listens for clicks on the modal
  clickModal();
};

/**
 * function to add the class 'done' which changes the text to be crossed out
 * when the checkbox is clicked
 * @param {object} checkbox the html element input type=checkbox
 * @param {object} group the list-group
 * @param {object} parentElement the element to be checked for the class 'done
 */
const addCheckboxClickListener = (icon, group, parentElement) => {
  const classDone = 'done';

  // add click listeners
  group.click(() => {
    if (parentElement.hasClass(classDone)) {
      parentElement.removeClass(classDone);
      icon.removeClass('fas fa-check fa-1x mr-3');
      icon.addClass('far fa-square fa-1x mr-3');
    } else {
      parentElement.addClass(classDone);
      icon.removeClass('far fa-square fa-1x mr-3');
      icon.addClass('fas fa-check fa-1x mr-3');
    }
  });
};

/**
 * function to render the detailed recipe information
 * @param {object} ingredient the response object from the search endpoint from Spoonacular's API
 * @param {object} parentElement the element that this appends to
 */
const renderIngredients = (ingredient, parentElement) => {
  const wrap = $('<div>');
  const listGroup = $('<li>', { class: 'list-group-item' });
  const icon = $('<i>', { class: 'far fa-square fa-1x mr-3' });
  const text = $('<p>', { class: 'd-inline' }).text(' ' + ingredient);

  addCheckboxClickListener(icon, listGroup, wrap);

  $('#' + parentElement).append(wrap);
  wrap.append(listGroup);
  listGroup.append(icon);
  listGroup.append(text);
};

/**
 * function to parse the instructions and render a <li> for each instruction
 * @param {string} instructions the instruction string from the getRecipeById api call
 * @param {string} elementName the id or string of the element
 */
const parseInstructions = (instructions, elementName) => {
  // split the array on the period and set the result to instructionsArr
  let instructionsArr = instructions.split('.');

  // loop through the instructions
  for (let i = 0; i < instructionsArr.length - 1; i++) {
    // render instruction
    renderIngredients(instructionsArr[i], elementName);
  }
};

/**
 * function to parse the ingredients array and render a <li> for each ingredient
 * @param {array} ingredients the extendedIngredients array to be traversed
 * @param {string} elementName the id or string of the element
 */
const parseIngredients = (ingredients, elementName) => {
  // loop through each ingredient in the array
  ingredients.forEach(ingredient => {
    // render ingredient
    renderIngredients(ingredient.original, elementName);
  });
};

/**
 * function that renders group headers
 * @param {string} elementName the id and string of the element
 * @param {string} recipeName the name of the recipe
 */
const renderGroupDetails = (elementName, recipeName) => {
  const div = $('<div>', { class: 'mt-3' });
  const ul = $('<ul>', { class: 'list-group', id: elementName });
  const ingredientsHeader = $('<li>', { class: 'list-group-item bg-primary mt-3' });
  const textHeader = $('<p>', { class: 'd-inline text-light' }).text(elementName + ' for ' + recipeName);

  $('#search-results').append(div);
  div.append(ul);
  ul.append(ingredientsHeader);
  ingredientsHeader.append(textHeader);
};

// function to get a random url from the unsplashImageArr
function randomImageUrl() {
  if (unsplashImageArr.length === 0) {
    return './assets/images/eggplant.gif';
  } else {
    return unsplashImageArr[Math.floor(Math.random() * unsplashImageArr.length)].urls.thumb;
  }
}

/**
 * function that renders the detailed recipe information
 * @param {object} recipe the response object from the search endpoint from Spoonacular's API
 */
const renderRecipeInfo = recipe => {
  // create html elements for the card
  const card = $('<div>', { class: 'card mt-3' });
  const cardHeader = $('<h6>', { class: 'card-header bg-primary text-light' }).text(recipe.title + ' - (Health Rating: ' + recipe.healthScore + ')');
  const row = $('<div>', { class: 'row no-gutters' });

  // column 1 (the image)
  const col1 = $('<div>', { class: 'col-md-4' });
  const img = $('<img>', { src: recipe.image, class: 'float-left mr-3 w-100 unsplash' });

  // column 2 (the recipe information)
  const col2 = $('<div>', { class: 'col-md-8' });
  const cardBody = $('<div>', { class: 'card-body' });
  const cardTitle = $('<h5>', { class: 'card-title' }).text('Prep. Time: ' + recipe.readyInMinutes + ' minute(s) - Serving Size: ' + recipe.servings);
  const nutritionButton = $('<button>', { class: 'btn btn-link text-dark p-0 d-block', id: 'nutrition-button' }).text('View Nutritional Info');
  const similarRecipes = $('<button>', { class: 'btn btn-link text-dark p-0 d-block', id: 'similar-button' }).text('View Similar Recipes');

  // append elements to the html
  $('#search-results').append(card);
  card.append(cardHeader, row);
  row.append(col1, col2);

  col1.append(img);

  col2.append(cardBody);
  cardBody.append(cardTitle, nutritionButton, similarRecipes);

  // handle rendering different images from Unsplash when the mouse is over the image
  $('.unsplash').mouseover(function() {
    hoverInterval = setInterval(function() {
      $('.unsplash').attr('src', randomImageUrl());
    }, 1500);
  });

  // revers image to original recipe image
  $('.unsplash').mouseout(function() {
    hoverInterval = clearInterval(hoverInterval);
    $('.unsplash').attr('src', recipe.image);
  });
};
/**
 * function to parse out a specific recipe from the array (recipeArr)
 * matching the given recipeId
 * @param {array} arr the recipe array to be traversed
 * @param {number} recipeId the id of the recipe to be searched for
 */
const parseRecipeArray = (arr, recipeId) => {
  // loop through recipeArr to find the response using the ID
  for (let i = 0; i < arr.length; i++) {
    // compare the ID of the buttton to the ID of the objects inside recipeArr
    if (arr[i].id === recipeId) {
      return arr[i];
    }
  }
};

/**
 * function that renders the detailed recipe information with ingredients,
 * step-by-step instructions, and other information
 */
function clickedRecipeDetails() {
  // clear all search results
  $('#search-results').empty();

  // scroll to the top of the page
  $('body').scrollTop(0);

  // get the ID of the button
  const id = parseInt($(this).attr('RecipeId'));

  // get the recipe from the recipeArr that matches the id
  const recipe = parseRecipeArray(recipeArr, id);

  // update the global variable
  currentRecipe = recipe;

  // render the recipe information
  renderRecipeInfo(recipe);

  // render the groups
  renderGroupDetails('Ingredients', recipe.title);

  // render the ingredients passing in the recipe's extendedIngredients
  parseIngredients(recipe.extendedIngredients, 'Ingredients');

  // the the recipe does not have any instructions...
  if (!recipe.instructions) {
    // render a modal displaying the warning
    renderModal('Warning', 'There are no instructions for this recipe.', 5);
  }
  // render the detailed recipe information otherwise
  else {
    renderGroupDetails('Instructions', recipe.title);
    parseInstructions(recipe.instructions, 'Instructions');
    getUnsplashImages();
  }

  // empty footer
  $('#footer').empty();
}

/**
 * function to render search results
 * @param {object} recipe the response object from the search endpoint from Spoonacular's API
 * @param {string} ingredients the ingredients of the recipe formatted into a string
 */
const renderSearchResults = (recipe, ingredients) => {
  // create html elements for the card
  const card = $('<div>', { class: 'card mt-3 recipe-details-card', recipeId: recipe.id });
  const cardHeader = $('<h6>', { class: 'card-header bg-primary text-light' }).text(recipe.title + ' - (Health Rating: ' + recipe.healthScore + ')');
  const row = $('<div>', { class: 'row no-gutters' });

  // column 1 (the image)
  const col1 = $('<div>', { class: 'col-md-4' });
  const img = $('<img>', { src: !recipe.image ? './assets/images/eggplant.gif' : recipe.image, class: 'float-left mr-3' });

  // column 2 (the recipe information)
  const col2 = $('<div>', { class: 'col-md-8' });
  const cardBody = $('<div>', { class: 'card-body' });
  const cardTitle = $('<h5>', { class: 'card-title' }).text('Prep. Time: ' + recipe.readyInMinutes + ' minute(s) - Serving Size: ' + recipe.servings);
  const cardText = $('<p>', { class: 'card-text' }).text('Ingredients: ' + ingredients);
  const button = $('<button>', { class: 'btn btn-link text-dark p-0 recipe-details-button', recipeId: recipe.id }).text('View Recipe Details');

  // append elements to the html
  $('#search-results').append(card);
  card.append(cardHeader, row);
  row.append(col1, col2);

  col1.append(img);

  col2.append(cardBody);
  cardBody.append(cardTitle, cardText, button);
};

/**
 * function to render the load button in the footer
 * @param {number} num a number indicating which api call the load button will change
 */
const renderLoadButton = num => {
  // create the element
  const button = $('<button>', { class: 'btn btn-primary text-light w-100', id: 'load-button' }).text('Load More');

  // append the element to the html
  $('#footer').append(button);

  // attach click listeners
  $('#load-button').click(() => {
    // switch statement to check which case the load button will do when clicked
    switch (num) {
      case 0:
        getRecipe(currentSearchTerm, (requestOffset += requestLimit));
        break;
      case 1:
        getRecipeByIngredients(currentSearchTerm, (requestLimit += MAX_REQUEST_LIMIT));
        break;
      case 2:
        getRandomRecipe();
        break;
      case 3:
        getSimilarRecipeId(currentRecipe.id, (requestLimit += MAX_REQUEST_LIMIT));
        break;
      case 4:
        getRecipeAdvance(requestFilter, currentSearchTerm, (requestOffset += requestLimit));
        break;
    }

    // empty footer
    $('#footer').empty();
  });
};

/**
 * function to retrieve input from the search bar where the user
 * is is searching for recipes by ingredients
 * @param {number} num a number indicating which function to call when search is clicked
 */
const getInputFromModal = num => {
  resetGlobalCounters();

  switch (num) {
    case 0:
      // check if .form-control is empty and alert user
      if (!$('#custom-search').val()) {
        renderModal('Warning', 'You must enter something to search...', 5);
        break;
      } else {
        // store search in input
        const input = $('#custom-search').val();

        // update currentSearchTerm with formatted ingredients
        currentSearchTerm = formatInputIngredients(input);

        // format the ingredients and call the getRecipeByIngredients
        getRecipeByIngredients(currentSearchTerm);
        break;
      }

    case 1:
      // store search in input
      const input = $('#custom-search').val();

      // update currentSearchTerm with the input
      currentSearchTerm = input;

      // update the requestFilter
      requestFilter = createFilterStr();

      // format the filters and call getRecipeAdvance
      getRecipeAdvance(requestFilter, input);
      break;
  }

  // clear previous search results
  $('#search-results').empty();

  // clear the footer
  $('#footer').empty();
};

// function to grab what the user searches for and call getRecipe to render the search results
const getInput = () => {
  resetGlobalCounters();

  // check if search input is empty and alert user
  if (!$('#regular-search').val()) {
    renderModal('Warning', 'You must enter something to search...', 5);
  }

  // else... user has entered text into the search bar
  else {
    // clear any previous search results
    clearSearchResults();

    // store and clean search in input
    const input = $('#regular-search')
      .val()
      .trim();

    // update the currentSearchTerm
    currentSearchTerm = input;

    // clear text from input
    $('#regular-search').val('');

    // get the recipe IDs
    getRecipe(input);

    // clear the footer
    $('#footer').empty();
  }
};

window.onload = () => {
  resetGlobalCounters();

  // listen for click on the search button
  $('#search-button').click(() => {
    getInput();
    $('#footer').empty();
  });

  // listen to click for home button
  $('#home-button').click(() => {
    clearSearchResults();
    $('#footer').empty();
  });

  // listen to click for the random recipe button
  $('#random-button').click(() => {
    getRandomRecipe();

    // clear the footer
    $('#footer').empty();
  });

  // listen for clicks on the searcy by ingredients dropdown link
  $('#search-by-ingredient').click(() => {
    clearSearchResults();
    renderModal('Search by Ingredients');
    renderSearchBar('Enter the ingredient(s)', 'Seperate ingredients by a space when searching with multiple.', 0);
  });

  // listen for clicks on the 'view detailed recipe' button or the search results card
  $(document).on('click', '.recipe-details-button', clickedRecipeDetails);
  $(document).on('click', '.recipe-details-card', clickedRecipeDetails);

  // listen for clicks on 'view nutirtion information'
  $(document).on('click', '#nutrition-button', () => {
    renderModal('Nutritional Information');
    parseNutritionInfo(currentRecipe);
  });

  // listen for clicks on 'view similar recipes'
  $(document).on('click', '#similar-button', () => {
    getSimilarRecipeId(currentRecipe.id);
    // clear the footer
    $('#footer').empty();
  });

  $('#scroll-up-button').click(function() {
    console.log('scroll up clicked');
    $('body').scrollTop(0);
  });
};
