const allCategories = {
  Cusines: [
    'African',
    'American',
    'British',
    'Cajun',
    'Caribbean',
    'Chinese',
    'Eastern',
    'European',
    'French',
    'German',
    'Greek',
    'Indian',
    'Irish',
    'Italian',
    'Japanese',
    'Jewish',
    'Korean',
    'Latin',
    'American',
    'Mediterranean',
    'Mexican',
    'Middle',
    'Eastern',
    'Nordic',
    'Southern',
    'Spanish',
    'Thai',
    'Vietnamese'
  ],
  Diets: ['Gluten Free', 'Ketogenic', 'Vgetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'],
  Intolerances: ['Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree', 'Nut', 'Wheat'],
  MealTypes: ['Main', 'Course', 'Side', 'Dish', 'Dessert', 'Appetizer', 'Salad', 'Bread', 'Breakfast', 'Soup', 'Beverage', 'Sauce', 'Marinade', 'Fingerfood', 'Snack', 'Drink']
};

const SortBy = [
  'Popularity',
  'Healthiness',
  'Price',
  'Time',
  'Alcohol',
  'Caffeine',
  'Copper',
  'Energy',
  'Calories',
  'Calcium',
  'Carbohydrates',
  'Carbs',
  'Choline',
  'Cholesterol',
  'Total-fat',
  'Fluoride',
  'Trans-fat',
  'Saturated-fat',
  'Mono-unsaturated-fat',
  'Poly-unsaturated-fat',
  'Fiber',
  'Folate',
  'Folic-acid',
  'Iodine',
  'Iron',
  'Magnesium',
  'Manganese',
  'Vitamin-b3',
  'Niacin',
  'Vitamin-b5',
  'Pantothenic-acid',
  'Phosphorus',
  'Potassium',
  'Protein',
  'Vitamin-b2',
  'Riboflavin',
  'Selenium',
  'Sodium',
  'Vitamin-b1',
  'Thiamin',
  'Vitamin-a',
  'Vitamin-b6',
  'Vitamin-b12',
  'Vitamin-c',
  'Vitamin-d',
  'Vitamin-e',
  'Vitamin-k',
  'Sugar',
  'Zinc'
];

// include ingredients, excluded ingredients, maxReadyTime, sort, sortdirection
const getRecipeAdvance = (searchTerm, offset = requestOffset, limit = requestLimit, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  //   const url = 'https://api.spoonacular.com/recipes/search?query=' + searchTerm + '&number=' + limit + '&apiKey=' + apiKey + '&offset=' + offset;
  const url = 'https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2&apiKey=' + apiKey;
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
        // // loop through the responses
        // res.results.forEach(recipe => {
        //   // call getRecipeById passing in the id from the response
        //   getRecipeById(recipe.id);
        // });
        // renderLoadButton(0);
        console.log('res :', res);
      }
    })
    .catch(err => console.log('Error occured searching for ' + searchTerm + ' ' + err));
};

// function parses and build url based on what the user checked etc...
const getAdvanceInput = () => {};

/**
 * function that returns all the checked boxes of value with the class name that matches the parameter
 * @param {string} elementClassName the element's class name
 */
const parseCheckBoxes = elementClassName => {
  return $('.' + elementClassName + ':checked')
    .map(function() {
      return this.value;
    })
    .get()
    .join(',+');
};

const renderRadioButtons = (name, category) => {
  const div = $('<div>', { class: 'custom-control custom-radio' });
  const input = $('<input>', { type: 'radio', id: name, name: category + 'Radio', class: 'custom-control-input' });
  const label = $('<label>', { class: 'custom-control-label', for: name }).text(name);

  $('.' + category).append(div);
  div.append(input, label);
};

const renderCheckboxes = (name, category) => {
  const formCheck = $('<div>', { class: 'form-check mb-2' });
  const input = $('<input>', { class: 'form-check-input' + category, type: 'checkbox', value: 'carribean', id: 'collapse' + category });
  const label = $('<label>', { class: 'form-check-label' }).text(name);

  $('.' + category).append(formCheck);
  formCheck.append(input, label);
};

//Render functions for Advanced Search feature
const renderCategories = (category, parentElement = '.modal-body') => {
  const button = $('<button>', { class: 'btn btn-primary w-100 mt-3', type: 'button', 'data-toggle': 'collapse', 'data-target': '#collapse' + category, id: category + '-button' }).text(category);
  const div = $('<div>', { class: 'collapse m-1', id: 'collapse' + category });
  const cardBody = $('<div>', { class: 'card card-body ' + category });

  $(parentElement).append(button);
  $(parentElement).append(div);
  div.append(cardBody);
};

const renderAdvanceForm = () => {
  Object.keys(allCategories).forEach(category => {
    renderCategories(category);

    allCategories[category].forEach(name => {
      renderCheckboxes(name, category);
    });
  });

  renderCategories('SortBy');
  SortBy.forEach(element => {
    renderRadioButtons(element, 'SortBy');
  });
};

//Test event listener
$('#search-by-filter').click(() => {
  event.preventDefault();
  renderModal('Advance Search');
  renderSearchBar('Search a recipe', '', 1);
  renderAdvanceForm();
});
