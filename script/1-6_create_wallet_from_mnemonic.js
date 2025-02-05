const { ethers } = require('ethers');

async function createWallet() {
  // Generate a new wallet
  const MNEMONIC =
    'scatter comfort twenty dry ketchup million source seminar team option ahead arctic';
  const wallet = ethers.Wallet.fromPhrase(MNEMONIC);

  console.log('🔹 New Wallet Created:');
  console.log(`📌 Address: ${wallet.address}`);
  console.log(`🔑 Private Key: ${wallet.privateKey}`);
  console.log(`🔑 Public Key: ${wallet.publicKey}`);
  console.log(`📜 Mnemonic: ${wallet?.mnemonic?.phrase}`);

  // You can save this wallet information securely
}

// Run the function
createWallet();
