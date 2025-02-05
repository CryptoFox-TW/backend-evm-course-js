require('dotenv').config();
const axios = require('axios');
const { Web3 } = require('web3');

const web3 = new Web3(process.env.MAINNET_RPC_URL);

const account = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5';

async function getAccountTransactionCountWithRpc(address) {
  const data = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_getTransactionCount',
    params: [address, 'latest'],
  });

  const config = {
    method: 'post',
    url: process.env.MAINNET_RPC_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const response = await axios.request(config);
  return response.data;
}

async function getAccountTransactionCountWithWeb3(address) {
  const transactionCount = await web3.eth.getTransactionCount(address);
  return transactionCount;
}

(async function main() {
  const accountTransactionCountRpc = await getAccountTransactionCountWithRpc(
    account
  );
  const accountTransactionCountWeb3 = await getAccountTransactionCountWithWeb3(
    account
  );

  console.log('Account transaction count:', {
    accountTransactionCountRpc,
    accountTransactionCountWeb3,
  });
})();
