let recipeArr; // array used to store the response from the api
let currentRecipe; // stores current recipe
const MAX_REQUEST_LIMIT = 3;
let requestOffset;
let requestLimit;
let currentSearchTerm;
let unsplashImageArr = [];
let hoverInterval;

// function to clear global counters
const resetGlobalCounters = () => {
  recipeArr = [];
  currentRecipe = '';
  currentSearchTerm = '';
  requestOffset = 0;
  requestLimit = MAX_REQUEST_LIMIT;
};

/**
 * formats the string by replacing spaces with commas and a plus
 * @param {string} input the string to be formatted
 */
const formatInputIngredients = input => {
  return input.replace(/ /g, ',+');
};

/**
 * function to retrieve input from the search bar where the user
 * is is searching for recipes by ingredients
 */
const getIngredientsFromInput = () => {
  resetGlobalCounters();

  // check if .form-control is empty and alert user
  if (!$('#ingredients-search').val()) {
    renderModal('Warning', 'You must enter something to search...');
  }

  // else... user has entered text into the search bar
  else {
    // store search in input
    const input = $('#ingredients-search').val();

    // clear previous search results
    $('#search-results').empty();

    // update currentSearchTerm with formatted ingredients
    currentSearchTerm = formatInputIngredients(input);

    // format the ingredients and call the getRecipeByIngredients
    getRecipeByIngredients(currentSearchTerm);
    $('#footer').empty();
  }
};

// function to render the search bar in the modal (used to search for recipes based on ingredients)
const renderSearchBar = () => {
  // create elements
  const divGroup = $('<div>', { class: 'input-group' });
  const input = $('<input>', { class: 'form-control', id: 'ingredients-search', type: 'text', placeholder: 'Enter the ingredient(s)' });
  const divInput = $('<div>', { class: 'input-group-append' });
  const button = $('<button>', { class: 'btn btn-dark', id: 'ingredient-search-button', type: 'button' }).text('Search');
  const p = $('<p>', { class: 'text-muted font-italic mx-2 mt-3 mb-1' }).text('Seperate ingredients by a space when searching with multiple.');

  // append elements
  $('.modal-body').append(divGroup);
  divGroup.append(input, divInput, p);
  divInput.append(button);

  // attach click listener
  $('#ingredient-search-button').click(() => {
    getIngredientsFromInput();
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
  const table = $('<table>', { class: 'table bg-white' });
  const thead = $('<thead>');
  const tr = $('<tr>');
  const thAmount = $('<th>', { class: 'font-weight-bold', scope: 'col' }).text('Amount');
  const thPercent = $('<th>', { class: 'font-weight-bold', scope: 'col' }).text('% Daily Value');

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

// function to prevent page reload and empty #search-results
const clearSearchResults = () => {
  event.preventDefault();
  $('#search-results').empty();
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

// function to render the modal
const renderModal = (title, message = '') => {
  const modalFade = $('<div>', { id: 'modal' });
  const modalDiaglogue = $('<div>', { class: 'modal-dialog' });
  const modalContent = $('<div>', { class: 'modal-content' });
  const modalHeader = $('<div>', { class: 'modal-header' });
  const modalTitle = $('<h5>', { class: 'modal-title' }).text(title);
  const modalBody = $('<div>', { class: 'modal-body' }).text(message);
  const modalFooter = $('<div>', { class: 'modal-footer' });
  const button = $('<button>', { class: 'btn btn-warning', id: 'modal-button' }).text('Close');

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
 * @param {object} div the element to be checked for the class 'done
 */
const addCheckboxClickListener = (checkbox, div) => {
  const classDone = 'done';

  // add click listeners
  checkbox.click(() => {
    if (div.hasClass(classDone)) {
      div.removeClass(classDone);
    } else {
      div.addClass(classDone);
    }
  });
};

/**
 * function to render the detailed recipe information
 * @param {object} ingredient the response object from the search endpoint from Spoonacular's API
 * @param {object} parentElement the element that this appends to
 */
const renderIngredients = (ingredient, parentElement) => {
  const li = $('<li>', { class: 'list-group-item' });
  const checkbox = $('<input>', { type: 'checkbox' });
  const p = $('<p>', { class: 'd-inline' }).text(' ' + ingredient);

  addCheckboxClickListener(checkbox, li);

  $('#' + parentElement).append(li);
  li.append(checkbox);
  li.append(p);
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
    // TODO: remove html tags from some results...

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
 */
const renderGroupDetails = (elementName, recipeName) => {
  const div = $('<div>', { class: 'mt-3' });
  const ul = $('<ul>', { class: 'list-group', id: elementName });
  const ingredientsHeader = $('<li>', { class: 'list-group-item bg-dark mt-3' });
  const textHeader = $('<p>', { class: 'd-inline text-light' }).text(elementName + ' for ' + recipeName);

  $('#search-results').append(div);
  div.append(ul);
  ul.append(ingredientsHeader);
  ingredientsHeader.append(textHeader);
};

/**
 * function that renders the detailed recipe information
 * @param {object} recipe the response object from the search endpoint from Spoonacular's API
 */
const renderRecipeInfo = recipe => {
  // create html elements for the card
  const card = $('<div>', { class: 'card mt-3' });
  const cardHeader = $('<div>', { class: 'card-header bg-dark text-light' }).text(recipe.title + ' - (Health Rating: ' + recipe.healthScore + ')');
  const row = $('<div>', { class: 'row no-gutters' });

  // column 1 (the image)
  const col1 = $('<div>', { class: 'col-md-4' });
  const img = $('<img>', { src: recipe.image, class: 'float-left mr-3 unsplash' });

  // column 2 (the recipe information)
  const col2 = $('<div>', { class: 'col-md-8' });
  const cardBody = $('<div>', { class: 'card-body' });
  const cardTitle = $('<h5>', { class: 'card-title' }).text('Prep. Time: ' + recipe.readyInMinutes + ' minute(s) - Serving Size: ' + recipe.servings);
  const nutritionButton = $('<button>', { class: 'btn btn-link p-0 d-block', id: 'nutrition-button' }).text('View Nutritional Info');
  const similarRecipes = $('<button>', { class: 'btn btn-link p-0 d-block', id: 'similar-button' }).text('View Similar Recipes');

  // append elements to the html
  $('#search-results').append(card);
  card.append(cardHeader, row);
  row.append(col1, col2);

  col1.append(img);

  col2.append(cardBody);
  cardBody.append(cardTitle, nutritionButton, similarRecipes);

  id = recipe.id;

  $('.unsplash').mouseover(function () {
    hoverInterval = setInterval(function () {
      $('.unsplash').attr('src', randomImageUrl());
    }, 1500)
  })

  $('.unsplash').mouseout(function () {
    hoverInterval = clearInterval(hoverInterval);
    $('.unsplash').attr('src', recipe.image)
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

  // get the ID of the button
  const id = parseInt($(this).attr('id'));

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
    renderModal('Warning', 'There are no instructions for this recipe.');
  }
  // render the detailed recipe information otherwise
  else {
    renderGroupDetails('Instructions', recipe.title);
    parseInstructions(recipe.instructions, 'Instructions');
    getUnsplashImages();

    // empty footer
    $('#footer').empty();
  }

}

// function to load the unsplasImageArr with the response
function getUnsplashImages(searchTerm = currentSearchTerm, apikey = UNSPLASH_API_KEY) {
  $.ajax({
    url: 'https://api.unsplash.com/search/photos/?client_id=' + apikey + "&page=1&query=" + searchTerm,
    method: 'GET'
  }).then(function (res) {
    unsplashImageArr = res.results;

  });
}

// function to get a random url from the unsplashImageArr
function randomImageUrl() {
  return unsplashImageArr[Math.floor(Math.random() * unsplashImageArr.length)].urls.thumb;
}

/**
 * function to render search results
 * @param {object} recipe the response object from the search endpoint from Spoonacular's API
 * @param {string} ingredients the ingredients of the recipe formatted into a string
 */
const renderSearchResults = (recipe, ingredients) => {
  // create html elements for the card
  const card = $('<div>', { class: 'card mt-3' });
  const cardHeader = $('<div>', { class: 'card-header bg-dark text-light' }).text(recipe.title + ' - (Health Rating: ' + recipe.healthScore + ')');
  const row = $('<div>', { class: 'row no-gutters' });

  // column 1 (the image)
  const col1 = $('<div>', { class: 'col-md-4' });
  const img = $('<img>', { src: !recipe.image ? './assets/images/eggplant.gif' : recipe.image, class: 'float-left mr-3' });

  // column 2 (the recipe information)
  const col2 = $('<div>', { class: 'col-md-8' });
  const cardBody = $('<div>', { class: 'card-body' });
  const cardTitle = $('<h5>', { class: 'card-title' }).text('Prep. Time: ' + recipe.readyInMinutes + ' minute(s) - Serving Size: ' + recipe.servings);
  const cardText = $('<p>', { class: 'card-text' }).text('Ingrediants: ' + ingredients);
  const button = $('<button>', { class: 'btn btn-link p-0 recipe-details-button', id: recipe.id }).text('View Recipe Details');

  // append elements to the html
  $('#search-results').append(card);
  card.append(cardHeader, row);
  row.append(col1, col2);

  col1.append(img);

  col2.append(cardBody);
  cardBody.append(cardTitle, cardText, button);
};

// function to grab what the user searches for and call getRecipe to render the search results
const getInput = () => {
  resetGlobalCounters();

  // check if search input is empty and alert user
  if (!$('#regular-search').val()) {
    renderModal('Warning', 'You must enter something to search...');
  }

  // else... user has entered text into the search bar
  else {
    // clear any previous search results
    clearSearchResults();

    // store and clean search in input
    const input = $('#regular-search')
      .val()
      .trim();

    //second api call unsplash api variable
    currentSearchTerm = input;

    // clear text from .form-control
    $('.form-control').val('');

    // clear text from input
    $('#regular-search').val('');

    // get the recipe IDs
    getRecipe(input);

    // clear the footer
    $('#footer').empty();
  }
};

/**
 * function that returns recipes that match the ingredients searched
 * @param {string} ingredients used to search recipes that contain these ingredients
 * @param {number} limit the max number of results returned
 * @param {boolean} isPantry true returns recipes containing common pantry ingredients
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeByIngredients = (ingredients, limit = requestLimit, isPantry = false, apiKey = SPOONACULAR_API_KEY) => {
  $('#modal').remove(); // delete modal
  clearSearchResults();

  // the url past to the request header

  const url = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' + ingredients + '&number=' + limit + '&apiKey=' + apiKey + '&ignorePantry=' + isPantry;
  // send a GET request to the recipe summary endpoint
  // https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      // check to see if response length is 0
      if (!res.length) {
        renderModal('Warning', 'Your search does not have any matches...'); // warn the user
      } else {
        // loop through each recipe from the response
        res.forEach(recipe => {
          // render the recipe using the id
          getRecipeById(recipe.id);
        });
        renderLoadButton(1);
      }
    })
    .catch(err => console.log('Error occured searching for recipes with ingredients(s): ' + ingredients + ' ' + err));
};

/**
 * function that returns up to the limit number of recipes and renders them
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRandomRecipe = (limit = 5, apiKey = SPOONACULAR_API_KEY) => {
  clearSearchResults();

  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/random?number=' + limit + '&apiKey=' + apiKey;

  // send a GET request to the recipe summary endpoint
  // https://spoonacular.com/food-api/docs#Get-Random-Recipes
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      // loop through each recipe from the response
      res.recipes.forEach(recipe => {
        // render the recipe using the id
        getRecipeById(recipe.id);
      });
      renderLoadButton(2);
    })
    .catch(err => console.log('Error occured searching for a random recipe: ' + err));
};

/**
 * function to get similar recipes
 * @param {string} id the id of the recipe
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getSimilarRecipeId = (id, limit = requestLimit, apiKey = SPOONACULAR_API_KEY) => {
  clearSearchResults();

  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/' + id + '/similar?number=' + limit + '&apiKey=' + apiKey;

  // send a GET request to the recipe summary endpoint
  // https://spoonacular.com/food-api/docs#Get-Similar-Recipes
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      res.forEach(recipe => {
        getRecipeById(recipe.id);
      });
      renderLoadButton(3);
    })
    .catch(err => console.log('Error occured searching for similar recipes with ID: ' + id + ' ' + err));
};

/**
 * function to grab the the summary of the recipe. returns the id,
 * title, and summary of the recipe
 * @param {string} id the id of the recipe
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeSummary = (id, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/' + id + '/summary?apiKey=' + apiKey;

  // send a GET request to the recipe summary endpoint
  // https://spoonacular.com/food-api/docs#Summarize-Recipe
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      console.log('getRecipeSummary()', res);
      return res.summary;
    })
    .catch(err => console.log('Error occured searching for recipe summary for ID: ' + id + ' ' + err));
};

/**
 * function to search spoonacular's api for the recipe instruction base
 * on the id of the recipe to get the detailed recipe instructions such
 * as the step-by-step instructions on how to prepare the recipe and
 * all the ingredients and nutrition information of the recipe
 * @param {string} id the id of the recipe
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeById = (id, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/' + id + '/information?includeNutrition=true' + '&apiKey=' + apiKey;

  // send a GET request to the detailed recipe endpoint
  // (https://spoonacular.com/food-api/docs#Get-Recipe-Information)
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      // string for ingredients
      let ingredientsStr = '';

      // loop through response and grab ingredients and append it to ingredientsStr
      for (let i = 0; i < res.extendedIngredients.length; i++) {
        ingredientsStr += res.extendedIngredients[i].name + ', ';
      }

      // remove any trailing commas
      ingredientsStr = ingredientsStr.replace(/,\s*$/, '');

      // add the recipe to the recipeArr to be accessed later by clickedRecipeDetails()
      recipeArr.push(res);

      // render search results
      renderSearchResults(res, ingredientsStr);
    })
    .catch(err => console.log('Error occured searching for ID: ' + id + ' ' + err));
};

/**
 * function to render the load button in the footer
 * @param {number} num a number indicating which api call the load button will change
 */
const renderLoadButton = num => {
  // create the element
  const button = $('<button>', { class: 'btn btn-dark w-100', id: 'load-button' }).text('Load More');

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
    }

    // empty footer
    $('#footer').empty();
  });
};

/**
 * function to search spoonacular's api for recipes that match the searchTerm
 * @param {string} searchTerm the search term to search the api (ex: ice cream, cheese)
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipe = (searchTerm, offset = requestOffset, limit = requestLimit, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/search?query=' + searchTerm + '&number=' + limit + '&apiKey=' + apiKey + '&offset=' + offset;
  // send a GET request to the search endpoint
  // (https://spoonacular.com/food-api/docs#Search-Recipes)
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      // check to see if response length is 0
      if (!res.results.length) {
        renderModal('Warning', 'Your search does not have any matches...'); // warn the user
      } else {
        // loop through the responses
        res.results.forEach(recipe => {
          // call getRecipeById passing in the id from the response
          getRecipeById(recipe.id);
        });
        renderLoadButton(0);
      }
    })
    .catch(err => console.log('Error occured searching for ' + searchTerm + ' ' + err));
};

window.onload = () => {
  resetGlobalCounters();

  // listen for click on the search button
  $('#search-button').click(() => {
    getInput();
  });

  // listen to click for home button
  $('#home-button').click(() => {
    clearSearchResults();
  });

  // listen to click for the random recipe button
  $('#random-button').click(() => {
    getRandomRecipe();

    // clear the footer
    $('#footer').empty();
  });

  // listen for clicks on the search-by-ingredient dropdown link
  $('#search-by-ingredient').click(() => {
    renderModal('Search by Ingredients');
    renderSearchBar();
  });

  // listen for clicks on the 'view detailed recipe' button
  $(document).on('click', '.recipe-details-button', clickedRecipeDetails);

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
};
