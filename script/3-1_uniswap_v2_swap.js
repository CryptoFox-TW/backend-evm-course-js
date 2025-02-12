const ethers = require('ethers');
const dotenv = require('dotenv');
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const UniswapV2FactoryABI = require('./abis/UniswapV2FactoryABI.json');
const UniswapV2PairABI = require('./abis/UniswapV2PairABI.json');
const ERC20ABI = require('./abis/ERC20ABI.json');

dotenv.config();

const UNISWAP_V2_FACTORY_ADDRESS = '0xF62c03E08ada871A0bEb309762E260a7a6a880E6'; // Uniswap V2 Factory Address
const UNISWAP_V2_ROUTER_ADDRESS = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3'; // Uniswap V2 Router Address
const WETH_ADDRESS = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'; // WETH Address
const TOKEN_ADDRESS = '0x0721099aBCd42f834000eD5c1B01c35CEED7A699'; // Token Address

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_HTTP_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const router = new ethers.Contract(
  UNISWAP_V2_ROUTER_ADDRESS,
  UniswapV2RouterABI,
  wallet
);

async function getPairAddress(tokenA, tokenB) {
  const factory = new ethers.Contract(
    UNISWAP_V2_FACTORY_ADDRESS, // Uniswap V2 Factory Address
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
  const token0 = await pairContract.token0();
  const token1 = await pairContract.token1();
  return { token0, token1 };
}

async function getAmountOut(amountIn, reserveIn, reserveOut) {
  //   const amountInWithFee = amountIn.mul(997);
  //   const numerator = amountInWithFee.mul(reserveOut);
  //   const denominator = reserveIn.mul(1000).add(amountInWithFee);
  //   return numerator.div(denominator);

  const amountOut = await router.quote(amountIn, reserveIn, reserveOut);

  return amountOut;
}

async function swapTokensV2(tokenIn, tokenOut, amountIn) {
  const pairAddress = await getPairAddress(tokenIn, tokenOut);

  console.log(`Pair Address: ${pairAddress}`);

  let { token0, token1 } = await getTokens(pairAddress);
  let { reserve0, reserve1 } = await getReserves(pairAddress);

  console.log(
    `Original: \n\tToken 0: ${token0}\n\tToken 1: ${token1}\n\tReserve 0: ${reserve0}\n\tReserve 1: ${reserve1}\n\t`
  );

  // swap if tokenIn is not reserve0
  if (tokenIn.toLowerCase() !== token0.toLowerCase()) {
    [token0, token1] = [token1, token0];
    [reserve0, reserve1] = [reserve1, reserve0];
  }

  console.log(
    `After Swap Sequence: \n\tToken 0: ${token0}\n\tToken 1: ${token1}\n\tReserve 0: ${reserve0}\n\tReserve 1: ${reserve1}\n\t`
  );

  const idealAmountOut =
    (BigInt(amountIn) * BigInt(reserve1)) / BigInt(reserve0);

  const amountOut = await getAmountOut(amountIn, reserve0, reserve1);

  const amountOutMin = (BigInt(idealAmountOut) * 95n) / 100n; // 設定 slippage 為 5%

  console.log(
    `Amount: \n\tIn: ${amountIn}\n\tIdeal Out: ${idealAmountOut}\n\tOut: ${amountOut}\n\tOut Min: ${amountOutMin}\n\t`
  );

  const tx = await router.swapExactETHForTokens(
    amountOutMin,
    [tokenIn, tokenOut],
    wallet.address,
    Math.floor(Date.now() / 1000) + 60 * 20, // 設定交易過期時間
    { gasLimit: 250000, value: amountIn }
  );

  console.log(`交易發送中: ${tx.hash}`);
  await tx.wait();
  console.log('交易成功！');
}

const amountIn = ethers.parseUnits('0.001', 'gwei'); // 例如 1 顆 token
swapTokensV2(WETH_ADDRESS, TOKEN_ADDRESS, amountIn);

/* Approve Token */
async function approveToken(tokenAddress) {
  const token = new ethers.Contract(tokenAddress, ERC20ABI, wallet);
  const approveTx = await token.approve(
    UNISWAP_V2_ROUTER_ADDRESS,
    ethers.MaxUint256
  );
  await approveTx.wait();
  console.log('Approved!');
}

// approveToken(TOKEN_ADDRESS);
// approveToken(WETH_ADDRESS);

/*
    Homework:
        1. 實現 UniSwapV2 的價格計算函數
        2. 實現 UniSwapV2 的預測 Pair 函數
        3. 接通 UniSwapV2 中更多的 swap 接口
    
*/
