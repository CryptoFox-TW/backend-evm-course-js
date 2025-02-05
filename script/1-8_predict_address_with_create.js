const { ethers } = require('ethers');

async function predictCreateAddress(deployerAddress, nonce) {
  // RLP encode [deployerAddress, nonce]
  const rlpEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint256'],
    [deployerAddress, nonce]
  );

  // Hash the encoded data and take the last 20 bytes
  const predictedAddress = '0x' + ethers.keccak256(rlpEncoded).slice(-40);

  console.log(`🔹 Predicted CREATE Address: ${predictedAddress}`);
}

// Example Usage
const deployer = '0x6A4481Eb81B9772b992aE58c429d508F5273b823'; // Replace with your deployer address
const nextNonce = 1; // Replace with actual deployer nonce

predictCreateAddress(deployer, nextNonce);
