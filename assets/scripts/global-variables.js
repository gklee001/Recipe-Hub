let recipeArr; // array of recipes
let currentRecipe; // current recipe object
let currentSearchTerm; // the recipe search term

// request limits
const MAX_REQUEST_LIMIT = 3;
let requestOffset;
let requestLimit;
let requestFilter;

// for unsplash api
let unsplashImageArr = [];
let hoverInterval;

let zIndex = 2; // defaults z-index for modals

// filters for advanced search
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

// sorting filters for advanced search
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
