let recipeArr = []; // array used to store the response from the api

/**
 * function to handle clicks on the modal
 */
const clickModal = () => {
  // Get the modal
  const modal = document.getElementById('modal');

  // when the user clicks the close button in the modal, close modal
  $('#modal-button').click(() => {
    $('#modal').attr('style', 'display: none');
  });

  // when the user clicks anywhere outside of the modal, close modal
  window.onclick = e => {
    if (e.target == modal) {
      $('#modal').attr('style', 'display: none');
    }
  };
};

/**
 * function to render the modal
 */
const renderModal = () => {
  const modalFade = $('<div>', { id: 'modal' });
  const modalDiaglogue = $('<div>', { class: 'modal-dialog' });
  const modalContent = $('<div>', { class: 'modal-content' });
  const modalHeader = $('<div>', { class: 'modal-header' });
  const modalTitle = $('<h5>', { class: 'modal-title' }).text('Warning');
  const modalBody = $('<div>', { class: 'modal-body' }).text('There are no isntructions for this recipe.');
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
 * function
 */
function clickedRecipeDetails() {
  // clear all search results
  $('#search-results').empty();

  // get the ID of the button
  const id = parseInt($(this).attr('id'));

  // get the recipe from the recipeArr that matches the id
  const recipe = parseRecipeArray(recipeArr, id);

  console.log('recipe clickedRecipeDetails():', recipe);

  const a = 'Ingredients';

  // render the groups
  renderGroupDetails(a, recipe.title);

  // render the ingredients passing in the recipe's extendedIngredients
  parseIngredients(recipe.extendedIngredients, a);

  if (!recipe.instructions) {
    renderModal();
  } else {
    const b = 'Instructions';
    renderGroupDetails(b, recipe.title);

    parseInstructions(recipe.instructions, b);
  }
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
  const cardBody = $('<div>', { class: 'card-body' });
  const img = $('<img>', { src: recipe.image, class: 'rounded float-left mr-3' });
  const cardTitle = $('<h5>', { class: 'card-title' }).text('Prep. Time: ' + recipe.readyInMinutes + ' minute(s) - Serving Size: ' + recipe.servings);
  const cardText = $('<p>', { class: 'card-text' }).text('Ingrediants: ' + ingredients);
  const button = $('<button>', { class: 'btn btn-primary recipe-details-button', id: recipe.id }).text('View Recipe Details');

  // append elements to the html
  $('#search-results').append(card);
  card.append(cardHeader, cardBody);
  cardBody.append(img, cardTitle, cardText, button);
};

/**
 * function to grab what the user searches for and call getRecipe to render the search results
 */
const getInput = () => {
  // empty out array
  recipeArr = [];

  // check if .form-control is empty and alert user
  if (!$('.form-control').val()) {
    alert('You must enter something to search...');
  }

  // else... user has entered text into the search bar
  else {
    // clear any previous search results
    $('#search-results').empty();

    // store search in input
    const input = $('.form-control')
      .val()
      .trim();

    // clear text from .form-control
    $('.form-control').val('');

    // call getRecipe() and pass in input as a searchTerm for the first parameter
    getRecipe(input);
  }
};

/**
 * function to get similar recipes
 * @param {string} id the id of the recipe
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getSimilarRecipeId = (id, limit = 5, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/' + id + '/similar?number=' + limit + '&apiKey=' + apiKey;

  // send a GET request to the recipe summary endpoint
  // https://spoonacular.com/food-api/docs#Get-Similar-Recipes
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      return res;
    })
    .catch(err => console.log('Error occured searching for ID: ' + ' ' + err));
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
      return res;
    })
    .catch(err => console.log('Error occured searching for ID: ' + ' ' + err));
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
 * function to search spoonacular's api for recipes that match the searchTerm
 * @param {string} searchTerm the search term to search the api (ex: ice cream, cheese)
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipe = (searchTerm, limit = 3, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/search?query=' + searchTerm + '&number=' + limit + '&apiKey=' + apiKey;
  console.log('url :', url);
  // send a GET request to the search endpoint
  // (https://spoonacular.com/food-api/docs#Search-Recipes)
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      // loop through the responses
      res.results.forEach(recipe => {
        // call getRecipeById passing in the id from the response
        getRecipeById(recipe.id);
      });
    })
    .catch(err => console.log('Error occured searching for ' + searchTerm + ' ' + err));
};

window.onload = () => {
  // listen for click
  $('#search-button').click(getInput);
  $(document).on('click', '.recipe-details-button', clickedRecipeDetails);

  // testing endpoints
  //   getRecipeSummary(215435);
  getSimilarRecipeId(215435);
};
