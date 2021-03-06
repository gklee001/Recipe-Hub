// Spoonacular API keys
const SPOONACULAR_KEYS = [
  '3cbf84afc3474e1a86dc5d352e165370',
  '84318aa841ff464b9769a932f579e5ac',
  'd07b4b2b71c446c3a2cc57c06d7d02d1',
  '73eaca384aed443085641900f3894f52',
  '99f1d7d42ced4448a90e0e2cdc63202f',
  '8c5382ce1bbe4d799ac8c3ccfef42225',
  '71003603a1f2400fb877c1fa258d98f3',
  '25b28062cc934d19858b28554eebddb4',
  'b3f5f562a9584038a00de41f5568ae40'
];

/**
 * function to select a random key from an array
 * @param {array} arr the array containing the keys
 */
const generateKey = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// generate a random key
const SPOONACULAR_API_KEY = generateKey(SPOONACULAR_KEYS);

const UNSPLASH_API_KEY = '5f075f2a36d998d71e48a195d5b190a4c0b4194471f1a8108f42370aa300ce04';
