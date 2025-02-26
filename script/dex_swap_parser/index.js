const {
  parseSwapExactETHForTokensData,
  parseSwapExactTokensForETHData,
} = require('./parse_uniswap_v2');

const methodSelectors = {
  '0x7ff36ab5': parseSwapExactETHForTokensData, // UniswapV2: swapExactETHForTokens
  '0x18cbafe5': parseSwapExactTokensForETHData, // UniswapV2: swapExactTokensForETH

  // Add more method selectors here ...
};

function parseTransactionData(txData) {
  const methodId = txData.slice(0, 10);
  const parser = methodSelectors[methodId];
  if (parser) {
    return parser(txData);
  } else {
    console.log('Unknown method selector:', methodId);
    return null;
  }
}
