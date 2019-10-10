const renderDetailedRecipe = (recipe) => {
	// render page using info from getRecipeInstructions(recipe.id, apiKey)
	// TODO: create html elements for the detailed recipe (what information do we want displayed?)
	// TODO: append the html elements
};

function clickedRecipeDetails() {
	// TODO: clear all search results
	$('#search-results').empty();
	// TODO: call getRecipeInstructions and pass in the ID
	let id = $(this).attr('id');
	console.log('ID: ', id);
	getRecipeInstructions(recipe);
}

/**
 * function to render search results
 * @param {object} recipe the response object from the search endpoint from Spoonacular's API
 */
const renderSearchResults = (recipe, ingredients) => {
	console.log(recipe);

	// create the html elements
	const card = $('<div>', { class: 'card mt-3' });
	const cardHeader = $('<div>', {
		class: 'card-header bg-dark text-light'
	}).text(recipe.title);
	const cardBody = $('<div>', { class: 'card-body' });
	const img = $('<img>', {
		src: recipe.image,
		class: 'rounded float-left mr-3'
	});
	const cardTitle = $('<h5>', { class: 'card-title' }).text(recipe.readyInMinutes + " minute(s) - Serving Size: " + recipe.servings);

	const cardText = $('<p>', { class: 'card-text' }).text("Ingrediants "+ ingredients);
	const cardRate = $('<h5.', { class: 'health-score'}).text(recipe.healthScore);
	const btn = $('<button>', {
		class: 'btn btn-primary recipe-details-button',
		id: recipe.id
	}).text('View Recipe Details');

	// append elements to the html
	$('#search-results').append(card);
	card.append(cardHeader, cardBody);
	cardBody.append(img, cardTitle, cardText, btn);
};

/**
 * function to grab what the user searches for and call getRecipe to render
 * the search results
 */
const getInput = () => {
	// TODO: check if .form-control is empty else...
	
	// TODO: clear any previous search results
	$('#search-results').empty();
	// TODO: clear all detailed recipe instructions

	// store search in input
	const input = $('.form-control')
		.val()
		.trim();

	// TODO: clear text from .form-control
	$('.form-control').val("");

	// call getRecipe() and pass in input as a searchTerm for the first parameter
	getRecipe(input, 2, SPOONACULAR_API_KEY);
};

/**
 * function to search spoonacular's api for the recipe instruction base
 * on the id of the recipe to get the detailed recipe instructions such
 * as the step-by-step instructions on how to prepare the recipe and
 * all the ingredients and nutrition information of the recipe
 * @param {string} id the id of the recipe
 * @param {string} apiKey the API key used to access spoonacular api
 */
const getRecipeInstructions = (id, apiKey) => {
	// the url past to the request header
	console.log(id);
	const url =
		'https://api.spoonacular.com/recipes/' +
		id +
		'/information?includeNutrition=false' +
		'&apiKey=' +
		apiKey;

	// send a GET request to the detailed recipe endpoint
	// (https://spoonacular.com/food-api/docs#Get-Recipe-Information)
	$.ajax({
		url,
		method: 'GET'
	})
		.then((res) => {
			// TODO: call renderDetailedRecipe passing in the response
			let ingredientsStr = '';
				for (let i = 0; i < res.extendedIngredients.length; i++) {
				ingredientsStr += res.extendedIngredients[i].name + ', ';
				}
				const ingredients = ingredientsStr.replace(/,\s*$/, '');
     			renderSearchResults(res, ingredients);

		})
		.catch((err) => console.log('Error occured', err));
};

/**
 * function to search spoonacular's api for recipes that match the searchTerm
 * @param {string} searchTerm the search term to search the api (ex: ice cream, cheese)
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

	// send a GET request to the search endpoint
	// (https://spoonacular.com/food-api/docs#Search-Recipes)
	$.ajax({
		url,
		method: 'GET'
	})
		.then((res) => {
			// loop through the responses
			for (let i = 0; i < res.results.length; i++) {

				getRecipeInstructions(res.results[i].id, apiKey);

				// render the search results passing in the response
				//renderSearchResults(res.results[i],recipeResults);
			}
		})
		.catch((err) => console.log('Error occured', err));
};

window.onload = () => {
	// listen for click
	$('#search-button').click(getInput);
	$(document).on('click', '.recipe-details-button', clickedRecipeDetails);

	// getRecipe('cheese', 1, SPOONACULAR_API_KEY);
	// getRecipeInstructions(21543, SPOONACULAR_API_KEY);
};
