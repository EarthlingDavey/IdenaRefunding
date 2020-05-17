const { safeFetch } = require('./helpers');

/**
 * Get the tx count for an idena address
 * Returns int
 */
async function getcount(address) {
  var path = 'https://api.idena.org/api/Address/' + address + '/Txs/Count';
  const response = await safeFetch(path);
  const json = await response.json();
  return parseInt(json.result);
}

/**
 * Get a range of transactions
 * Returns array of transaction objects
 */
async function gettxs(skip, limit, address) {
  var path =
    'https://api.idena.org/api/Address/' +
    address +
    '/Txs?skip=' +
    skip +
    '&limit=' +
    limit;
  const response = await safeFetch(path);
  const json = await response.json();
  return json.result;
}

module.exports = {
  getcount,
  gettxs,
};
