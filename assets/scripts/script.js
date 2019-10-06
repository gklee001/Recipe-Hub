/**
 * function to search spoonacular's api for the recipe instruction base
 * on the id of the recipe
 * @param {*} id the id of the recipe
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
    .then((res) => {
      // console.log(res);
      console.log(res.instructions);
    })
    .catch((err) => console.log('Error occured', err));
};

/**
 * function to search spoonacular's api for recipes with recipes
 * with the matching search term
 * @param {string} searchTerm the search term to search the api
 * @param {integer} limit the number of results returned from the request
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipe = (searchTerm, limit, apiKey) => {
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
    .then((res) => {
      for (let i = 0; i < res.results.length; i++) {
        //   console.log('hi');
        console.log(res.results[i]);
        getRecipeInstructions(res.results[i].id, apiKey);
      }
    })
    .catch((err) => console.log('Error occured', err));
};

window.onload = () => {
  getRecipe('cheese', 5, SPOONACULAR_API_KEY);
  // getRecipeInstructions(21543, SPOONACULAR_API_KEY);
};
