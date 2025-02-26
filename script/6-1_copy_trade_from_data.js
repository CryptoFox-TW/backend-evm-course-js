const dotenv = require('dotenv');
const { ethers } = require('ethers');
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const ERC20ABI = require('./abis/ERC20ABI.json');

dotenv.config();

const iUniswapV2Router = new ethers.Interface(UniswapV2RouterABI);
const iERC20 = new ethers.Interface(ERC20ABI);

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_HTTP_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const methodSelectors = {
  '0x7ff36ab5': copySwapExactETHForTokensTx,
  '0x18cbafe5': copySwapExactTokensForETHTx,

  // Add more method selectors here ...
};

async function copyTransaction(tx) {
  const methodId = tx.data.slice(0, 10);
  const copier = methodSelectors[methodId];
  if (copier) {
    return await copier(tx);
  } else {
    console.log('Unknown method selector:', methodId);
    return null;
  }
}

async function copySwapExactETHForTokensTx(tx) {
  try {
    const decoded = iUniswapV2Router.decodeFunctionData(
      'swapExactETHForTokens',
      tx.data
    );
    console.log('decoded', decoded);
    const ethBalance = await provider.getBalance(wallet.address);

    let txValue = ethBalance;
    let amountOutMin = decoded.amountOutMin;
    let deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes

    if (ethBalance <= tx.value) {
      txValue = ethBalance - ethers.parseEther('0.001');
      amountOutMin = (decoded.amountOutMin * txValue) / tx.value;
    }

    const txData = iUniswapV2Router.encodeFunctionData(tx.data.slice(0, 10), [
      amountOutMin,
      decoded.path,
      wallet.address,
      deadline,
    ]);

    return txData;
  } catch (e) {
    console.log('Error:', e);
  }
}

async function copySwapExactTokensForETHTx(tx, provider) {
  const decoded = iUniswapV2Router.decodeFunctionData(
    'swapExactTokensForETH',
    tx.data
  );
  console.log('decoded', decoded);

  // get token balance
  const tokenAddress = decoded.path[0];
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);

  const tokenBalance = await tokenContract.balanceOf(wallet.address);
  let amountIn = decoded.amountIn;

  if (tokenBalance < amountIn) {
    amountIn = tokenBalance;
  }

  const txData = iUniswapV2Router.encodeFunctionData(tx.data.slice(0, 10), [
    amountIn,
    decoded.amountOutMin,
    decoded.path,
    wallet.address,
    Math.floor(Date.now() / 1000) + 600,
  ]);

  return txData;
}

async function main() {
  const txHash =
    '0xe25f4609a96de9368d372d8fc3fd2c3c43dc3f450fc36d4e87fb5a37209e99ba';
  const tx = await provider.getTransaction(txHash);

  const txData = await copyTransaction(tx);
  const feeData = await provider.getFeeData();

  const txResponse = await wallet.sendTransaction({
    to: tx.to,
    data: txData,
    value: tx.value,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    gasLimit: 300000,
  });

  const receipt = await txResponse.wait();
  console.log(`Transaction receipt: ${JSON.stringify(receipt, null, 2)}`);
}

main();
