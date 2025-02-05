require('dotenv').config();
const axios = require('axios');
const { Web3 } = require('web3');

const web3 = new Web3(process.env.MAINNET_RPC_URL);

const account = '0xD91A69C3453A884deF888e777cF14652C6a24d9E';

async function getAccountCodeWithRpc(address) {
  const data = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_getCode',
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

async function getAccountCodeWithWeb3(address) {
  const code = await web3.eth.getCode(address);
  return code;
}

(async function main() {
  const accountCodeRpc = await getAccountCodeWithRpc(account);
  const accountCodeWeb3 = await getAccountCodeWithWeb3(account);

  console.log('Account code:', {
    accountCodeRpc,
    accountCodeWeb3,
  });
})();
