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
  // '0x18cbafe5': copySwapExactTokensForETHTx,

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
    console.log('tx.value', tx.value.toString());

    const ethBalance = await provider.getBalance(wallet.address);
    console.log('ethBalance', ethBalance.toString());

    let txValue = ethBalance;
    let amountOutMin = decoded.amountOutMin;
    let deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes

    tx.value = BigInt('100000000000000000000');

    if (ethBalance <= tx.value) {
      txValue = ethBalance - ethers.parseEther('0.001');
      amountOutMin = (decoded.amountOutMin * txValue) / tx.value;
    }

    console.log('txValue', txValue.toString());
    console.log('amountOutMin', amountOutMin.toString());

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

async function main() {
  const txHash =
    '0xe25f4609a96de9368d372d8fc3fd2c3c43dc3f450fc36d4e87fb5a37209e99ba';
  const tx = await provider.getTransaction(txHash);

  const txData = await copyTransaction(tx);
}

main();

// async function copySwapExactTokensForETHTx(tx, provider) {
//   const decoded = iUniswapV2Router.decodeFunctionData(
//     'swapExactTokensForETH',
//     tx.data
//   );
//   return executeCopyTrade(tx, decoded, userAddress, provider);
// }

// async function executeCopyTrade(originalTx, decoded, userAddress, provider) {
//   const tokenIn = decoded.path ? decoded.path[0] : decoded.tokenIn;
//   const tokenContract = new ethers.Contract(
//     tokenIn,
//     ['function balanceOf(address) view returns (uint256)'],
//     provider
//   );
//   const balance = await tokenContract.balanceOf(userAddress);
//   let amountIn = decoded.amountIn || originalTx.value;
//   let amountOutMin = decoded.amountOutMin || decoded.amountOutMinimum;

//   if (balance.lt(amountIn)) {
//     const ratio = balance.mul(ethers.BigNumber.from(10).pow(18)).div(amountIn);
//     amountIn = balance;
//     amountOutMin = amountOutMin
//       .mul(ratio)
//       .div(ethers.BigNumber.from(10).pow(18));
//   }

//   const txData = iUniswapV2Router.encodeFunctionData(
//     originalTx.data.slice(0, 10),
//     [amountIn, amountOutMin, ...Object.values(decoded).slice(2)]
//   );

//   return signer.sendTransaction({
//     to: originalTx.to,
//     data: txData,
//     value: originalTx.value,
//     gasLimit: ethers.utils.hexlify(300000),
//   });
// }
