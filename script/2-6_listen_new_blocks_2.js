require('dotenv').config();
const axios = require('axios');
const { ethers } = require('ethers');

// Load environment variables
const RPC_HTTP_URL = process.env.SEPOLIA_HTTP_RPC_URL; // HTTP RPC URL
const RPC_WSS_URL = process.env.SEPOLIA_WS_RPC_URL; // WebSocket URL
const TRACK_ADDRESS =
  '0x26aDF778004B8d449a5bE0192A2DcF86acb13bE5'.toLowerCase(); // Address to track

// Setup WebSocket provider
const provider = new ethers.WebSocketProvider(RPC_WSS_URL);

console.log(
  `🔍 Listening for new blocks and tracking transactions involving: ${TRACK_ADDRESS}...`
);

// Sleep function (確保 setTimeout 正常運作)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch block receipts via eth_getBlockReceipts
async function getBlockReceipts(blockNumber) {
  try {
    const block = await provider.getBlock(blockNumber);
    if (!block || !block.transactions) return;

    const response = await axios.post(RPC_HTTP_URL, {
      jsonrpc: '2.0',
      method: 'eth_getBlockReceipts',
      params: [block.hash],
      id: 1,
    });
    return response.data.result || [];
  } catch (error) {
    console.error('❌ Error fetching block receipts:', error);
    return [];
  }
}

// Listen for new blocks
provider.on('block', async (blockNumber) => {
  try {
    await sleep(1000);
    const receipts = await getBlockReceipts(blockNumber);

    receipts.forEach((receipt) => {
      if (!receipt) return;
      const blockHash = receipt.blockHash;
      const txHash = receipt.transactionHash;
      const from = receipt.from?.toLowerCase();
      const to = receipt.to?.toLowerCase();

      console.log(`🔗 Block Hash: ${blockHash}`);
      console.log(`📌 Transaction Hash: ${txHash}`);
      console.log(`🔹 From: ${from}`);
      console.log(`🔹 To: ${to}`);
      console.log(`💰 Gas Used: ${receipt.gasUsed}`);
      console.log(
        `⛽ Effective Gas Price: ${ethers.formatUnits(
          receipt.effectiveGasPrice,
          'gwei'
        )} Gwei`
      );
      console.log('----------------------------');
    });
  } catch (error) {
    console.error('❌ Error processing block:', error);
  }
});
