const { ethers } = require('ethers');

async function createWallet() {
  // Generate a new wallet
  const PRIVATE_KEY =
    '0x56b9edc667234b3f3cbbd29a41649d9edf5c16f9a0e445cfee3fbaf20d221140';
  const wallet = new ethers.Wallet(PRIVATE_KEY);

  console.log('🔹 New Wallet Created:');
  console.log(`📌 Address: ${wallet.address}`);
  console.log(`🔑 Private Key: ${wallet.privateKey}`);
  console.log(`🔑 Public Key: ${wallet.publicKey}`);
  console.log(`📜 Mnemonic: ${wallet?.mnemonic?.phrase}`);

  // You can save this wallet information securely
}

// Run the function
createWallet();
