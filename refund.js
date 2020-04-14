// make sure the capital is capital  and nonce will be zero if the address wasn't used before ...and epoch 
var  address = "0xa6A5B8BDd503401037410080C8C064F7aAbB5BF0";
const util = require('util')
const request = require("request");
const RLP = require('rlp');
const ethers = require('ethers');
const { SigningKey } = require('ethers/utils/signing-key');
const privateKey = "de196a5bffc5554d8a739bb9f8d7a0cc8c3a18cb903d6d0c99a50c5687924900";
var currnonce = 0;
var epoch =42;
async function transfer (amount,to,nonce,epoch){
	


  const data = [
    nonce, // nonce
    epoch, // epoch
    0, // type
    to, // to
    amount*1000000000000000000, // amount (0. 000 000 000 000 000 001)
    100000, // max fee (0.000000000000010000)
    null, // tips
    '0x', // payload (can be null too)
  ];

  const rlpData = await RLP.encode(data);
  const hash = await ethers.utils.keccak256(rlpData);

  var key = new SigningKey(privateKey);

  const sig = await  key.signDigest(hash);

  const joinedSignature = Buffer.concat([
    Buffer.from(sig.r.substr(2), 'hex'),
    Buffer.from(sig.s.substr(2), 'hex'),
    Buffer.from([sig.recoveryParam]),
  ]);

  const res = [...data, joinedSignature];
  const rlpResult = await RLP.encode(res);
 

return await rlpResult.toString('hex')
	}
async function getcount(){
var path =  'https://api.idena.org/api/Address/'+address+'/Txs/Count';
const requestPromise = util.promisify(request);
const response = await requestPromise(path);
   return response.body;
}

async function gettxs(skip,limit){
var path =  'https://api.idena.org/api/Address/'+address+'/Txs?skip='+skip+'&limit='+limit;
const requestPromise = util.promisify(request);
const response = await requestPromise(path);
 return  response.body;
}


  async  function refund (){
    
     var  countjson = await getcount();
     var parsedcountjson = JSON.parse(countjson);
     var count = parsedcountjson['result'];
     var counth = count/100;
    
       for (i = 0; i < counth; i++) {
     
    let  parsedtxsjson = await JSON.parse(await gettxs(i*100,100));
    
    for (var tx of parsedtxsjson["result"]) 
  {
  
      if ( tx["type"] == 'SendTx' && tx["amount"] > 0 && tx["to"] == address){
      



currnonce = currnonce + 1

var options = {
  uri: 'https://rpc.idena.dev',
  method: 'POST',
  json: {
    "method": "bcn_sendRawTx",
    "id":2,
    "params":["0x"+await transfer(tx["amount"]-0.00001, tx["from"] ,currnonce,epoch)]
    
  }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  console.log(	response.body);
   }
});

      	}
}
       
    	}}
refund();
