const { ethers } = require('ethers');
require('dotenv').config();
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');

const provider = new ethers.WebSocketProvider(process.env.SEPOLIA_WS_RPC_URL);

(async function main() {
  const txHash =
    '0xe25f4609a96de9368d372d8fc3fd2c3c43dc3f450fc36d4e87fb5a37209e99ba';
  const tx = await provider.getTransaction(txHash);

  console.log('Transaction Input Data:', tx.data);

  // // Method 1: Decode using interface parseTransaction
  const ifaceV2 = new ethers.Interface(UniswapV2RouterABI);
  let decoded = ifaceV2.parseTransaction({
    data: tx.data,
    value: tx.value,
  });
  console.log('Decoded Swap Data:', decoded);

  // Method 2: Decode using interface decodeFunctionData
  const data = tx.data;
  const methodSelector = data.slice(0, 10);
  console.log('Method Selector:', methodSelector);
  const methodSignature = ifaceV2.getFunction(methodSelector);
  console.log('Method Signature:', methodSignature);
  const decodedData = ifaceV2.decodeFunctionData(methodSignature, data);
  console.log('Decoded Data:', decodedData);
})();
