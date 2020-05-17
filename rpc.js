const { safeFetch } = require('./helpers');

/**
 * Get the current epoch
 * Returns int
 */
async function getepoch() {
  var path = 'https://rpc.idena.dev';
  var options = {
    method: 'POST',
    body: JSON.stringify({
      method: 'dna_epoch',
      id: 2,
      params: [],
    }),
    headers: { 'Content-Type': 'application/json' },
  };

  const response = await safeFetch(path, options);
  const json = await response.json();
  return parseInt(json.result.epoch);
}

/**
 * Get the current nonce
 * Not finished
 * Returns ???
 */
async function getnonce() {
  var path = 'https://rpc.idena.dev';
  var options = {
    method: 'POST',
    body: JSON.stringify({
      method: 'dna_balance', // <!--- TODO - up to here
      id: 2,
      params: ['' + address + ''],
    }),
    headers: { 'Content-Type': 'application/json' },
  };

  console.log(options);

  const response = await safeFetch(path, options);
  console.log(response);

  const json = await response.json();

  // return json.result;
  // TODO - delete this request when safeFetch is tested and working
  // await request(options, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var parsedcountjson = JSON.parse(response.body)
  //     currnonce = parsedcountjson['result']['nonce']
  // };
}

module.exports = {
  getepoch,
  getnonce,
};
