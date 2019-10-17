/**
 * function to load the unsplasImageArr with the response
 * @param {string} searchTerm the search term to search the api (ex: ice cream, cheese)
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getUnsplashImages = (searchTerm = currentSearchTerm, apikey = UNSPLASH_API_KEY) => {
  $.ajax({
    url: 'https://api.unsplash.com/search/photos/?client_id=' + apikey + '&page=1&query=' + searchTerm,
    method: 'GET'
  }).then(function(res) {
    unsplashImageArr = res.results;
  });
};

/**
 * function to search all recipes using filters and ranking
 * @param {string} filters the filter string returned from createFilterStr()
 * @param {string} searchTerm the search term to search the api (ex: ice cream, cheese)
 * @param {number} offset the number of results to skip
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeAdvance = (filters, searchTerm, offset = requestOffset, limit = requestLimit, apiKey = SPOONACULAR_KEYS[0]) => {
  // the url past to the request header
  const url = 'https://api.spoonacular.com/recipes/complexSearch?query=' + searchTerm + '&number=' + limit + '&offset=' + offset + '&apiKey=' + apiKey + filters;

  // send a GET request to the search endpoint
  // https://spoonacular.com/food-api/docs#Search-Recipes-Complex
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
        renderLoadButton(4);
      }
    })
    .catch(err => console.log('Error occured searching for ' + searchTerm + ' ' + err));
};

/**
 * function that returns recipes that match the ingredients searched
 * @param {string} ingredients used to search recipes that contain these ingredients
 * @param {number} limit the max number of results returned
 * @param {boolean} isPantry true returns recipes containing common pantry ingredients
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeByIngredients = (ingredients, limit = requestLimit, isPantry = false, apiKey = SPOONACULAR_KEYS[0]) => {
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
        renderModal('Warning', 'Your search does not have any matches...', 5); // warn the user
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
const getRandomRecipe = (limit = requestLimit, apiKey = SPOONACULAR_KEYS[0]) => {
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
const getSimilarRecipeId = (id, limit = requestLimit, apiKey = SPOONACULAR_KEYS[0]) => {
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
 * function to search spoonacular's api for the recipe instruction base
 * on the id of the recipe to get the detailed recipe instructions such
 * as the step-by-step instructions on how to prepare the recipe and
 * all the ingredients and nutrition information of the recipe
 * @param {string} id the id of the recipe
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeById = (id, apiKey = SPOONACULAR_KEYS[0]) => {
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
 * @param {number} offset the number of results to skip
 * @param {number} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipe = (searchTerm, offset = requestOffset, limit = requestLimit, apiKey = SPOONACULAR_KEYS[0]) => {
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
        renderModal('Warning', 'Your search does not have any matches...', 5); // warn the user
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
