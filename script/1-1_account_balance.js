require('dotenv').config();
const axios = require('axios');
const { Web3 } = require('web3');

const web3 = new Web3(process.env.MAINNET_RPC_URL);

const eoaAddress = '0x6A4481Eb81B9772b992aE58c429d508F5273b823';
const contractAddress = '0xfdd05552F1377aA488AFed744c8024358AF02041';

async function getAccountBalanceWithRpc(address) {
  const data = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_getBalance',
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

async function getAccountBalanceWithWeb3(address) {
  const balance = await web3.eth.getBalance(address);
  return balance;
}

(async function main() {
  const eoaAddressBalance = await getAccountBalanceWithRpc(eoaAddress);
  const contractAddressBalance = await getAccountBalanceWithWeb3(
    contractAddress
  );

  console.log('Balances:', {
    eoaAddressBalance,
    contractAddressBalance,
  });
})();
