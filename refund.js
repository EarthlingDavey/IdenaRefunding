// make sure the capital is capital  and nonce will be zero if the address wasn't used before ...and epoch
var address = '0xa6A5B8BDd503401037410080C8C064F7aAbB5BF0';
const util = require('util');

const RLP = require('rlp');
const ethers = require('ethers');
const { SigningKey } = require('ethers/utils/signing-key');
const privateKey =
  'de196a5bffc5554d8a739bb9f8d7a0cc8c3a18cb903d6d0c99a50c5687924900';
var currnonce = 0;
var epoch = 42;

const { safeFetch } = require('./helpers');
const { getepoch, getnonce } = require('./rpc');
const { getcount, gettxs } = require('./api');

// getnonce();

/**
 * Builds a signed string for a transfer
 */
async function transfer(amount, to, nonce, epoch) {
  const data = [
    nonce, // nonce
    epoch, // epoch
    0, // type
    to, // to
    amount * 1000000000000000000, // amount (0. 000 000 000 000 000 001)
    100000, // max fee (0.000000000000010000)
    null, // tips
    '0x', // payload (can be null too)
  ];

  const rlpData = await RLP.encode(data);
  const hash = await ethers.utils.keccak256(rlpData);
  const key = new SigningKey(privateKey);
  const sig = await key.signDigest(hash);

  const joinedSignature = Buffer.concat([
    Buffer.from(sig.r.substr(2), 'hex'),
    Buffer.from(sig.s.substr(2), 'hex'),
    Buffer.from([sig.recoveryParam]),
  ]);

  const res = [...data, joinedSignature];
  const rlpResult = await RLP.encode(res);

  return await rlpResult.toString('hex');
}

/**
 * Get a range of transactions
 * Returns array of transaction objects
 */
async function refund() {
  var count = await getcount(address);
  var counth = count / 100;

  for (i = 0; i < counth; i++) {
    let txs = await gettxs(i * 100, 100, address);

    console.log(txs);

    for (var j in txs) {
      const tx = txs[j];

      if (tx.type == 'SendTx' && tx.amount > 0 && tx.to == address) {
        // console.log(tx);
        currnonce = currnonce + 1;

        const amountAdjusted = tx.amount - 0.00001;

        if (amountAdjusted <= 0) {
          return;
        }

        const transferResult = await transfer(
          amountAdjusted,
          tx.from,
          currnonce,
          epoch
        );

        console.log({
          transferResult,
        });

        var options = {
          uri: 'https://rpc.idena.dev',
          method: 'POST',
          body: JSON.stringify({
            method: 'bcn_sendRawTx',
            id: i + '-' + j,
            params: ['0x' + transferResult],
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        };

        console.log(options);

        const response = await safeFetch(path, options);
        const json = await response.json();

        // TODO - delete this request when safeFetch is tested and working
        // request(options, function (error, response, body) {
        //   if (!error && response.statusCode == 200) {
        //     console.log(response.body);
        //   }
        // });
      }
    }
  }
}

refund();
