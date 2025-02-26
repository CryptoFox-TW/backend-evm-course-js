// file: pendingTxListener.js
const { ethers } = require('ethers');
require('dotenv').config();
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const UniswapV3RouterABI = require('./abis/UniswapV3RouterABI.json');

const provider = new ethers.WebSocketProvider(process.env.SEPOLIA_WS_RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const methodSelectors = {
  '0x7ff36ab5': 'swapExactETHForTokens',
  '0x18cbafe5': 'swapExactTokensForETH',
  // Add more method selectors here ...
};

// provider.on('pending', async (txHash) => {
//   try {
//     const tx = await provider.getTransaction(txHash);
//     if (!tx) return;

//     if (
//       tx.to === process.env.UNISWAP_V2_ROUTER ||
//       tx.to === process.env.UNISWAP_V3_ROUTER
//     ) {
//       console.log('[Pending] Detected Uniswap Swap:', tx);
//       const decodedData = decodeTransaction(tx);
//       console.log('Decoded Swap Data:', decodedData);
//       // TODO: 判斷是否要跟單並執行交易
//       executeCopyTrade(decodedData);
//     }
//   } catch (error) {
//     console.error('Error fetching pending tx:', error);
//   }
// });

function decodeTransaction(tx) {
  try {
    const ifaceV2 = new ethers.Interface(UniswapV2RouterABI);
    const ifaceV3 = new ethers.Interface(UniswapV3RouterABI);

    let decoded;
    try {
      decoded = ifaceV2.parseTransaction({ data: tx.data, value: tx.value });
      console.log('Decoded using Uniswap V2 ABI');
    } catch (err) {
      try {
        decoded = ifaceV3.parseTransaction({ data: tx.data, value: tx.value });
        console.log('Decoded using Uniswap V3 ABI');
      } catch (err) {
        console.log('Transaction data does not match Uniswap V2 or V3');
        return null;
      }
    }
    return decoded;
  } catch (error) {
    console.error('Error decoding transaction:', error);
    return null;
  }
}

async function executeCopyTrade(decodedData) {
  if (!decodedData) return;
  try {
    console.log('Executing copy trade for:', decodedData);
    // TODO: 在這裡加入你的交易邏輯，例如 swapExactTokensForTokens
  } catch (error) {
    console.error('Error executing copy trade:', error);
  }
}

(async function main() {
  const txHash =
    '0x7617ae6c57fb8763e6655085fa33e98a644efc4dff879f13b430d6cdedb59678';
  const tx = await provider.getTransaction(txHash);

  let decoded = decodeTransaction(tx);
  console.log('Decoded Swap Data:', decoded.name);
})().then(() => process.exit(0));
