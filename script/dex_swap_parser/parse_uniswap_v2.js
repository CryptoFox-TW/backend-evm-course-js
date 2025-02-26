const { ethers } = require('ethers');
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const ifaceV2 = new ethers.utils.Interface(UniswapV2RouterABI);

async function parseSwapExactETHForTokensData(tx) {}

async function parseSwapExactTokensForETHData(tx) {}

module.exports = {
  parseSwapExactETHForTokensData,
  parseSwapExactTokensForETHData,
};
