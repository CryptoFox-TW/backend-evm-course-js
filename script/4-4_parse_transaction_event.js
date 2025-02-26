const { ethers } = require('ethers');
require('dotenv').config();
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const UniswapV2PairABI = require('./abis/UniswapV2PairABI.json');

const provider = new ethers.WebSocketProvider(process.env.SEPOLIA_HTTP_RPC_URL);

(async function main() {
  const txHash =
    '0x7617ae6c57fb8763e6655085fa33e98a644efc4dff879f13b430d6cdedb59678';
  const receipt = await provider.getTransactionReceipt(txHash);

  for (const log of receipt.logs) {
    const ifaceV2 = new ethers.Interface(UniswapV2RouterABI);
    const decoded = ifaceV2.parseLog(log);

    console.log('Decoded Swap Data:', decoded);
  }
})();
