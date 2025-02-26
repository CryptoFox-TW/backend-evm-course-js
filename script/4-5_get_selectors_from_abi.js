const { ethers } = require('ethers');
require('dotenv').config();
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const UniswapV2FactoryABI = require('./abis/UniswapV2FactoryABI.json');

async function main() {
  const iUniswapV2Router = new ethers.Interface(UniswapV2RouterABI);

  // Get all method selectors
  console.log('=== Router Methods ===');
  iUniswapV2Router.forEachFunction((method, index) => {
    console.log(`${method.selector} - ${method.name}`);
  });

  // Get all event selectors
  console.log('\n=== Factory Events ===');
  const iUniswapV2fACtory = new ethers.Interface(UniswapV2FactoryABI);
  iUniswapV2fACtory.forEachEvent((event, index) => {
    console.log(`${event.topicHash} - ${event.name}`);
  });
}

main().then(() => process.exit(0));
