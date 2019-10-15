const allCategories = {
  Cuisine: [
    'african',
    'american',
    'british',
    'cajun',
    'caribbean',
    'chinese',
    'eastern',
    'european',
    'french',
    'german',
    'greek',
    'indian',
    'irish',
    'italian',
    'japanese',
    'jewish',
    'korean',
    'latin',
    'american',
    'mediterranean',
    'mexican',
    'middle',
    'eastern',
    'nordic',
    'southern',
    'spanish',
    'thai',
    'vietnamese'
  ],
  Diet: ['gluten free', 'ketogenic', 'vegetarian', 'lacto-vegetarian', 'ovo-vegetarian', 'vegan', 'pescetarian', 'paleo', 'primal', 'whole30'],
  Intolerances: ['dairy', 'egg', 'gluten', 'grain', 'peanut', 'seafood', 'sesame', 'shellfish', 'soy', 'sulfite', 'tree', 'nut', 'wheat'],
  Type: ['main', 'course', 'side', 'dish', 'dessert', 'apppetizer', 'salad', 'bread', 'breakfast', 'soup', 'severage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink']
};

const sort = [
  'popularity',
  'healthiness',
  'price',
  'time',
  'alcohol',
  'caffeine',
  'copper',
  'energy',
  'calories',
  'calcium',
  'carbohydrates',
  'carbs',
  'choline',
  'cholesterol',
  'total-fat',
  'fluoride',
  'trans-fat',
  'saturated-fat',
  'mono-unsaturated-fat',
  'poly-unsaturated-fat',
  'fiber',
  'folate',
  'folic-acid',
  'iodine',
  'iron',
  'magnesium',
  'manganese',
  'vitamin-b3',
  'niacin',
  'vitamin-b5',
  'pantothenic-acid',
  'phosphorus',
  'potassium',
  'protein',
  'vitamin-b2',
  'riboflavin',
  'selenium',
  'sodium',
  'vitamin-b1',
  'thiamin',
  'vitamin-a',
  'vitamin-b6',
  'vitamin-b12',
  'vitamin-c',
  'vitamin-d',
  'vitamin-e',
  'vitamin-k',
  'sugar',
  'zinc'
];

// include ingredients, excluded ingredients, maxReadyTime, sortdirection
const getRecipeAdvance = (filters, searchTerm, offset = requestOffset, limit = requestLimit, apiKey = SPOONACULAR_API_KEY) => {
  // the url past to the request header
  //   const url = 'https://api.spoonacular.com/recipes/search?query=' + searchTerm + '&number=' + limit + '&apiKey=' + apiKey + '&offset=' + offset;
  const url = 'https://api.spoonacular.com/recipes/complexSearch?query=' + searchTerm + '&number=' + limit + '&offset=' + offset + '&apiKey=' + apiKey + filters;
  console.log('url :', url);
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

// function parses and build part of the request url based on what the user checked
const createFilterStr = () => {
  console.log('createFilterStr() called');
  let result = '';

  // loop through each category
  Object.keys(allCategories).forEach(category => {
    // call parseCheckBoxes to get what was checked seperated by ,+
    const categoriesChecked = parseCheckBoxes('form-check-input-' + category);

    // lowercase the first letter of the category for the result string
    category = category.charAt(0).toLowerCase() + category.substring(1);

    // if the category was not checked, append an empty string, otherwise append what was returned from parseCheckBoxes
    categoriesChecked === '' ? (result += '') : (result += '&' + category + '=' + categoriesChecked);
  });

  // add to the result string what the user wants to sort by
  result += '&sort=' + $('#sortByButton').val();

  // add to the result string what direction the user wants to sort by
  result += '&sortDirection=' + $('#orderByButton').val();

  // add included ingredients to the result string
  const includedIngredients = formatInputIngredients($('#include-input').val());

  includedIngredients === '' ? '' : (result += '&includeIngredients=' + formatInputIngredients($('#include-input').val()));

  // add excluded ingredients to the result string
  const excludedIngredients = formatInputIngredients($('#exclude-input').val());

  excludedIngredients === '' ? '' : (result += '&excludeIngredients=' + formatInputIngredients($('#exclude-input').val()));

  return result;
};

/**
 * function that returns all the checked boxes of value with the class name that matches the parameter
 * @param {string} category the category of the filter
 */
const parseCheckBoxes = category => {
  // parse the string
  const str = $('.' + category + ':checked')
    .map(function() {
      return this.value; // return's jQuery of elements that was checked
    })
    .get() // gets you an array
    .join(',+'); // join each array element with ,+ in between

  // returns empty string if the parse string is nothing, otherwise return the parse string
  return str === '' ? '' : str;
};

/**
 * function to render the input elements
 * @param {string} placeholderTxt the placeholder text to be appended to the input
 * @param {string} id the id of the element
 */
const renderInputBar = (placeholderTxt, id) => {
  // create elements
  const divGroup = $('<div>', { class: 'input-group mt-3' });
  const searchBar = $('<input>', { class: 'form-control', id: id, type: 'text', placeholder: placeholderTxt });
  const divInput = $('<div>', { class: 'input-group-append' });

  // append elements
  $('.modal-body').append(divGroup);
  divGroup.append(searchBar, divInput);
};

/**
 * function to render options for each sorting filter
 * @param {string} preTxt the text to append before the name
 * @param {string} name the name of each element in the category
 * @param {string} parentElement the parentElement to append this to
 */
const renderDropDownButton = (preTxt, name, parentElement) => {
  // create the element
  const option = $('<option>', { class: 'text-dark bg-light', value: name }).text(preTxt + name);

  // append the element
  $(parentElement).append(option);
};

/**
 * function to render the drop down filter
 * @param {string} elementId the id of this element
 * @param {string} parentElement the element to append this element to
 */
const renderDropDown = (elementId, parentElement = '.modal-body') => {
  // create the element
  const select = $('<select>', { class: 'form-control w-100 mt-3 bg-primary text-light', id: elementId });

  // append the element
  $(parentElement).append(select);
};

/**
 * function to render checkboxes
 * @param {string} name the name of each element in the category
 * @param {string} category the category of the filter
 */
const renderCheckboxes = (name, category) => {
  const formCheck = $('<div>', { class: 'form-check mb-2' });
  const input = $('<input>', { class: 'form-check-input-' + category, type: 'checkbox', value: name });
  const label = $('<label>', { class: 'form-check-label' }).text(name);

  $('.' + category).append(formCheck);
  formCheck.append(input, label);
};

/**
 * function to render toggle buttons for each category filter
 * @param {string} category the category of the filter
 * @param {string} parentElement the element to append this element to
 */
const renderCategories = (category, parentElement = '.modal-body') => {
  const button = $('<button>', { class: 'btn btn-primary w-100 mt-3 text-left', type: 'button', 'data-toggle': 'collapse', 'data-target': '#collapse' + category, id: category + '-button' }).text(
    category
  );
  const div = $('<div>', { class: 'collapse m-1', id: 'collapse' + category });
  const cardBody = $('<div>', { class: 'card card-body ' + category });

  $(parentElement).append(button);
  $(parentElement).append(div);
  div.append(cardBody);
};

// render's all the advance search filters in the modal
const renderAdvanceForm = () => {
  // loop through each categor
  Object.keys(allCategories).forEach(category => {
    // render the category toggle buttons
    renderCategories(category);

    // loop through each array in allCategories
    allCategories[category].forEach(name => {
      // render checkboxes
      renderCheckboxes(name, category);
    });
  });

  // render drop down menu for sort by
  renderDropDown('sortByButton');

  // loop through the sort array
  sort.forEach(element => {
    // create options for each sort
    renderDropDownButton('Sort by: ', element, '#sortByButton');
  });

  // render drop down menu for order by
  renderDropDown('orderByButton');
  renderDropDownButton('Order by: ', 'descending', '#orderByButton');
  renderDropDownButton('Order by: ', 'ascending', '#orderByButton');

  // render input to include / exclude ingredients
  renderInputBar('Enter ingredients to include', 'include-input');
  renderInputBar('Enter ingredients to exclude', 'exclude-input');
};

// listen for clicks on advance search
$('#search-by-filter').click(() => {
  event.preventDefault();
  renderModal('Advance Search');
  renderSearchBar('Search a recipe', '', 1);
  renderAdvanceForm();
});
