const ethers = require('ethers');
const dotenv = require('dotenv');
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const UniswapV2FactoryABI = require('./abis/UniswapV2FactoryABI.json');
const UniswapV2PairABI = require('./abis/UniswapV2PairABI.json');
const ERC20ABI = require('./abis/ERC20ABI.json');

dotenv.config();

const UNISWAP_V2_FACTORY_ADDRESS = '0xF62c03E08ada871A0bEb309762E260a7a6a880E6';
const UNISWAP_V2_ROUTER_ADDRESS = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3';
const WETH_ADDRESS = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
const TOKEN_ADDRESS = '0x0721099aBCd42f834000eD5c1B01c35CEED7A699';

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_HTTP_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const router = new ethers.Contract(
  UNISWAP_V2_ROUTER_ADDRESS,
  UniswapV2RouterABI,
  wallet
);

async function getPairAddress(tokenA, tokenB) {
  const factory = new ethers.Contract(
    UNISWAP_V2_FACTORY_ADDRESS,
    UniswapV2FactoryABI,
    provider
  );
  return await factory.getPair(tokenA, tokenB);
}

async function getReserves(pairAddress) {
  const pairContract = new ethers.Contract(
    pairAddress,
    UniswapV2PairABI,
    provider
  );
  const [reserve0, reserve1] = await pairContract.getReserves();
  return { reserve0, reserve1 };
}

async function getTokens(pairAddress) {
  const pairContract = new ethers.Contract(
    pairAddress,
    UniswapV2PairABI,
    provider
  );
  return {
    token0: await pairContract.token0(),
    token1: await pairContract.token1(),
  };
}

async function getTokenDecimals(tokenAddress) {
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
  return await tokenContract.decimals();
}

async function approveToken(tokenAddress, amount) {
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, wallet);
  const allowance = await tokenContract.allowance(
    wallet.address,
    UNISWAP_V2_ROUTER_ADDRESS
  );

  if (allowance < amount) {
    console.log(`Approving ${amount} tokens...`);
    const tx = await tokenContract.approve(
      UNISWAP_V2_ROUTER_ADDRESS,
      ethers.MaxUint256
    );
    await tx.wait();
    console.log('Approval successful!');
  } else {
    console.log('Token already approved.');
  }
}

/** 🟢 買入 Token */
async function buyToken(amountInETH, tokenOut) {
  console.log(`Buying token ${tokenOut} with ${amountInETH} ETH...`);

  const pairAddress = await getPairAddress(WETH_ADDRESS, tokenOut);
  const { token0, token1 } = await getTokens(pairAddress);
  const { reserve0, reserve1 } = await getReserves(pairAddress);

  const [reserveIn, reserveOut] =
    token0.toLowerCase() === WETH_ADDRESS.toLowerCase()
      ? [reserve0, reserve1]
      : [reserve1, reserve0];

  const idealAmountOut =
    (BigInt(amountInETH) * BigInt(reserveOut)) / BigInt(reserveIn);
  const amountOutMin = (BigInt(idealAmountOut) * 95n) / 100n; // 設定 5% Slippage

  console.log(`Estimated Out: ${idealAmountOut}, Min Out: ${amountOutMin}`);

  const tx = await router.swapExactETHForTokens(
    amountOutMin,
    [WETH_ADDRESS, tokenOut],
    wallet.address,
    Math.floor(Date.now() / 1000) + 60 * 20,
    { value: amountInETH, gasLimit: 250000 }
  );

  console.log(`Transaction sent: ${tx.hash}`);
  await tx.wait();
  console.log('Buy transaction successful!');
}

/** 🔴 賣出 Token */
async function sellToken(tokenIn, amountIn) {
  console.log(`Selling ${amountIn} of token ${tokenIn} for ETH...`);

  await approveToken(tokenIn, amountIn);

  const pairAddress = await getPairAddress(tokenIn, WETH_ADDRESS);
  const { token0, token1 } = await getTokens(pairAddress);
  const { reserve0, reserve1 } = await getReserves(pairAddress);

  const [reserveIn, reserveOut] =
    token0.toLowerCase() === tokenIn.toLowerCase()
      ? [reserve0, reserve1]
      : [reserve1, reserve0];

  const idealAmountOut =
    (BigInt(amountIn) * BigInt(reserveOut)) / BigInt(reserveIn);
  const amountOutMin = (BigInt(idealAmountOut) * 95n) / 100n; // 設定 5% Slippage

  console.log(`Estimated Out: ${idealAmountOut}, Min Out: ${amountOutMin}`);

  const tx = await router.swapExactTokensForETH(
    amountIn,
    amountOutMin,
    [tokenIn, WETH_ADDRESS],
    wallet.address,
    Math.floor(Date.now() / 1000) + 60 * 20,
    { gasLimit: 250000 }
  );

  console.log(`Transaction sent: ${tx.hash}`);
  await tx.wait();
  console.log('Sell transaction successful!');
}

// **測試買賣功能**
(async () => {
  const amountInETH = ethers.parseUnits('0.01', 'ether'); // 0.01 ETH
  const amountInTokens = ethers.parseUnits('1', 'ether'); // 1 Token

  try {
    await buyToken(amountInETH, TOKEN_ADDRESS);
    await sellToken(TOKEN_ADDRESS, amountInTokens);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
})();
