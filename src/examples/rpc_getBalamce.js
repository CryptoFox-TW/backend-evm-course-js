const config = require('../config');

const { Web3 } = require('web3');
const web3 = new Web3(config.rpc);

const account = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5';

web3.eth
  .getBalance(account, 'latest')
  .then((balance) => {
    console.log(balance);
  })
  .catch((error) => {
    console.error(error);
  });
