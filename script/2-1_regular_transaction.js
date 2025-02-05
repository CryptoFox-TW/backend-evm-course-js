require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables (set these in a .env file)
const PRIVATE_KEY = process.env.PRIVATE_KEY; // ⚠️ Keep it private!
const RPC_URL = process.env.SEPOLIA_RPC_URL; // Infura, Alchemy, or local node

async function main() {
  // Initialize provider (Ethereum JSON-RPC node)
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Create wallet from private key
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Fetch latest nonce for the sender
  const nonce = await provider.getTransactionCount(wallet.address);

  // Fetch network gas fee estimates (EIP-1559)
  const feeData = await provider.getFeeData();
  const maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei'); // Fallback if unavailable
  const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('30', 'gwei'); // Fallback if unavailable

  // Define transaction details (EIP-1559)
  const tx = {
    to: '0x26aDF778004B8d449a5bE0192A2DcF86acb13bE5', // Replace with recipient address
    value: ethers.parseEther('0.01'), // Amount in ETH
    nonce: nonce,
    gasLimit: ethers.toBigInt(21000), // Standard gas limit for ETH transfer
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: maxFeePerGas,
    type: 2, // EIP-1559 transaction type
    chainId: 11155111, // Mainnet (change for other networks)
  };

  console.log('Transaction details:', tx);

  const signedTx = await wallet.signTransaction(tx);
  console.log('Signed transaction:', signedTx);

  const txResponse = await provider.broadcastTransaction(signedTx);
  console.log(`Transaction response:`, txResponse);

  // Wait for confirmation
  const receipt = await txResponse.wait();
  console.log(`Transaction receipt: ${JSON.stringify(receipt, null, 2)}`);
  console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
}

main().catch(console.error);
