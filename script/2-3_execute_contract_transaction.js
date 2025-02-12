require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = '0x60c8EF0A8eD426f88555415e5553FCc640711147'; // Ensure this is set in .env

// Contract ABI
const CONTRACT_ABI = [
  'constructor(string memory _message)',
  'function number() public view returns (uint256)',
  'function setNumber(uint256 _newNumber) public',
  'function increment() public',
];

// Initialize provider & wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function main() {
  try {
    console.log(`Connected to contract at: ${CONTRACT_ADDRESS}`);

    // 1️⃣ Read current number
    const num = await contract.number();
    console.log(`Current Number: ${num}`);

    // 2️⃣ Estimate gas for setting a new number
    const newNumber = 42;
    const gasEstimate = await contract.setNumber.estimateGas(newNumber);
    console.log(
      `Estimated Gas for setNumber(${newNumber}): ${gasEstimate.toString()}`
    );

    // 3️⃣ Set new number
    console.log(`Updating number to: ${newNumber}...`);
    const tx1 = await contract.setNumber(newNumber);
    console.log(`setNumber() Transaction Hash: ${tx1.hash}`);
    await tx1.wait();
    console.log('✅ Number updated successfully!');

    // // 4️⃣ Increment number
    // console.log('Incrementing number...');
    // const tx2 = await contract.increment();
    // console.log(`increment() Transaction Hash: ${tx2.hash}`);
    // await tx2.wait();
    // console.log('✅ Number incremented successfully!');

    // 5️⃣ Read updated number
    const updatedNum = await contract.number();
    console.log(`Updated Number: ${updatedNum}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
main();
