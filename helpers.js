const fetch = require('node-fetch');

/**
 * Helper function to fetch a url
 */

const safeFetch = async (url, options = {}) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  safeFetch,
};
