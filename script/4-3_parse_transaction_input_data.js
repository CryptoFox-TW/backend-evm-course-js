const { ethers } = require('ethers');
require('dotenv').config();
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');

const provider = new ethers.WebSocketProvider(process.env.SEPOLIA_WS_RPC_URL);

(async function main() {
  const txHash =
    '0x7617ae6c57fb8763e6655085fa33e98a644efc4dff879f13b430d6cdedb59678';
  const tx = await provider.getTransaction(txHash);

  console.log('Transaction Input Data:', tx.data);

  // Method 1: Decode using interface parseTransaction
  const ifaceV2 = new ethers.Interface(UniswapV2RouterABI);
  let decoded = ifaceV2.parseTransaction({
    data: tx.data,
    value: tx.value,
  });
  console.log('Decoded Swap Data:', decoded);

  // Method 2: Decode using interface decodeFunctionData
  const data = tx.data;
  const methodId = data.slice(0, 10);
  console.log('Method ID:', methodId);
  const methodSignature = ifaceV2.getFunction(methodId);
  console.log('Method Signature:', methodSignature);
  const decodedData = ifaceV2.decodeFunctionData(methodSignature, data);
  console.log('Decoded Data:', decodedData);
})();
