function clickedRecipeDetails() {
  let clicked = $(this).attr('id');
  console.log(clicked);
}

const renderDetailedRecipe = recipe => {
  // render page using info from getRecipeInstructions(recipe.id, apiKey)
};

const renderSearchResults = recipe => {
  // clear children
  // recipe parameters is the object passed in from getRecipe()
  // renders recipe
  // render an <a> that user can click on which passes recipe.id and loads recipe instruction . html
};

const getInput = () => {
  // grab input
  // call getRecipe() and pass in input as a parameter
};

/**
 * function to search spoonacular's api for the recipe instruction base
 * on the id of the recipe
 * @param {string} id the id of the recipe
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeInstructions = (id, apiKey) => {
  // the url past to the request header
  const url =
    'https://api.spoonacular.com/recipes/' +
    id +
    '/information?includeNutrition=false' +
    '&apiKey=' +
    apiKey;

  // send a GET request
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      console.log(res);
      console.log(res.instructions);
    })
    .catch(err => console.log('Error occured', err));
};

/**
 * function to search spoonacular's api for recipes with recipes
 * with the matching search term
 * @param {string} searchTerm the search term to search the api
 * @param {integer} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipe = (searchTerm, limit = 10, apiKey) => {
  // the url past to the request header
  const url =
    'https://api.spoonacular.com/recipes/search?query=' +
    searchTerm +
    '&number=' +
    limit +
    '&apiKey=' +
    apiKey;

  // send a GET request
  $.ajax({
    url,
    method: 'GET'
  })
    .then(res => {
      for (let i = 0; i < res.results.length; i++) {
        // call renderSearchResults() passing in an object {id of recipe, ingredients, images, etc.}
        console.log(res.results[i]);
        getRecipeInstructions(res.results[i].id, apiKey);
      }
    })
    .catch(err => console.log('Error occured', err));
};

window.onload = () => {
  // $('#search-button').click(getInput);
  $(document).on('click', '.recipe-details-button', clickedRecipeDetails);
  // getRecipe('cheese', 1, SPOONACULAR_API_KEY);
  // getRecipeInstructions(21543, SPOONACULAR_API_KEY);
};
