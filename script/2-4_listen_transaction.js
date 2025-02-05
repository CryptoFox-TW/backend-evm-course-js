require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables
const RPC_WSS_URL = process.env.SEPOLIA_WS_RPC_URL; // WebSocket URL (Infura, Alchemy, or local node)
const TRACK_ADDRESS = '0x1dCf3F1cf255B273918B94dd0953Be13F491D8AB'; // Address to track

// Setup WebSocket provider
const provider = new ethers.WebSocketProvider(RPC_WSS_URL);

console.log(`🔍 Listening for transactions involving: ${TRACK_ADDRESS}...`);

// Listen for **all** new pending transactions
provider.on('pending', async (txHash) => {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) return;

    // Check if the tracked address is the sender or receiver
    if (
      tx.from?.toLowerCase() === TRACK_ADDRESS.toLowerCase() ||
      tx.to?.toLowerCase() === TRACK_ADDRESS.toLowerCase()
    ) {
      console.log(`📌 New Transaction: ${txHash}`);
      console.log(`🔹 From: ${tx.from}`);
      console.log(`🔹 To: ${tx.to}`);
      console.log(`💰 Value: ${ethers.formatEther(tx.value)} ETH`);
      console.log(
        `⛽ Gas Price: ${ethers.formatUnits(tx.gasPrice, 'gwei')} Gwei`
      );
      console.log('----------------------------');
    }
  } catch (error) {
    console.error('❌ Error fetching transaction:', error);
  }
});
