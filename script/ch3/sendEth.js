import Web3 from 'web3';

// Define your provider (use Infura, Alchemy, or any other provider URL)
const web3 = new Web3(
  'https://eth-sepolia.g.alchemy.com/v2/TYWdAcIlByMmx_MKEb2HpZ0L3WcgVLBk'
);

// Your private key (never share this in production code)
const privateKey =
  '0x4a1754db61929c037dd05adeb0390638827daf6458644c40b0cff37719ced768';

// Define the sender address (derived from the private key)
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const senderAddress = account.address;

// Define the recipient address and the amount to send (in ETH)
const recipientAddress = '0x5ec8e1f3a37d68e4031ead5f7575f6c74CDFE203';
const amountInEther = '0.001'; // Amount to send (e.g., 0.01 ETH)

async function sendEther() {
  try {
    console.log("Sender's Address:", senderAddress);
    // Get the current transaction count (nonce) for the sender's address
    const nonce = await web3.eth.getTransactionCount(senderAddress);
    console.log('Nonce:', nonce);

    const gasPrice = await web3.eth.getGasPrice();
    console.log('Gas Price:', gasPrice);

    // Create the transaction object
    const tx = {
      from: senderAddress,
      to: recipientAddress,
      value: web3.utils.toWei(amountInEther, 'ether'), // Convert Ether amount to wei
      gas: 21000, // Gas limit for a standard ETH transfer
      gasPrice: gasPrice, // Gas price in wei
      nonce: nonce,
      chainId: 11155111, // Mainnet chain ID (use 5 for Goerli, 11155111 for Sepolia)
    };
    console.log('Transaction:', tx);

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    console.log('Signed Transaction:', signedTx);

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    console.log('Transaction sent! Waiting for confirmation...');
    console.log('Transaction Hash:', receipt.transactionHash);
    console.log('Transaction confirmed in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

sendEther();
