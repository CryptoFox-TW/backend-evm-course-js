require('dotenv').config();
const axios = require('axios');
const { ethers } = require('ethers');

// Load environment variables
const RPC_HTTP_URL = process.env.SEPOLIA_HTTP_RPC_URL;
const RPC_WSS_URL = process.env.SEPOLIA_WS_RPC_URL;
const TRACK_ADDRESS =
  '0xA8ff7CbE22046021a2977304472487eFcE68eb95'.toLowerCase();
const UNISWAP_V2_ROUTER_ADDRESS = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3';

// WebSocket provider
let provider;
let pingInterval;

// WebSocket 初始化
function initWebSocketProvider() {
  console.log('🔄 Connecting to WebSocket...');
  provider = new ethers.WebSocketProvider(RPC_WSS_URL);

  provider.websocket.on('open', () => {
    console.log('✅ WebSocket connected');
    startPing();
  });

  provider.websocket.on('close', () => {
    console.error('❌ WebSocket disconnected. Reconnecting in 3s...');
    clearInterval(pingInterval);
    setTimeout(initWebSocketProvider, 3000);
  });

  provider.on('error', (error) => {
    console.error('⚠️ WebSocket error:', error);
  });

  provider.on('block', async (blockNumber) => {
    console.log(`🔗 New block: ${blockNumber}`);
    try {
      const receipts = await getBlockReceipts(blockNumber);
      await processReceipts(receipts);
    } catch (error) {
      console.error('❌ Error processing block:', error);
    }
  });
}

// 保持 WebSocket 連線
function startPing() {
  clearInterval(pingInterval);
  pingInterval = setInterval(() => {
    if (provider && provider.websocket.readyState === 1) {
      console.log('📡 Sending ping to keep connection alive');
      provider.websocket.ping();
    }
  }, 30000);
}

initWebSocketProvider();

// 獲取區塊交易收據
async function getBlockReceipts(blockNumber) {
  try {
    const block = await provider.getBlock(blockNumber);
    if (!block || !block.transactions) return [];

    const response = await axios.post(RPC_HTTP_URL, {
      jsonrpc: '2.0',
      method: 'eth_getBlockReceipts',
      params: [block.hash],
      id: 1,
    });

    return response.data.result || [];
  } catch (error) {
    console.error('❌ Error fetching block receipts:', error);
    return [];
  }
}

// 處理交易收據
async function processReceipts(receipts) {
  const trades = await Promise.all(
    receipts
      .filter(
        (receipt) =>
          receipt &&
          receipt.from.toLowerCase() === TRACK_ADDRESS &&
          receipt.to.toLowerCase() === UNISWAP_V2_ROUTER_ADDRESS
      )
      .map(async (receipt) => {
        console.log(`📌 Processing transaction: ${receipt.transactionHash}`);
        const tx = await provider.getTransaction(receipt.transactionHash);
        return copyTradeFromData(tx);
      })
  );

  // 過濾掉無效交易
  trades.filter((trade) => trade !== null);
}

// 解析交易數據
async function copyTradeFromData(tx) {
  const methodId = tx.data.slice(0, 10);
  const copier = methodSelectors[methodId];

  if (!copier) {
    console.log('⚠️ Unknown method selector:', methodId);
    return null;
  }

  return copier(tx);
}

// Uniswap V2 交易方法選擇器
const methodSelectors = {
  '0x7ff36ab5': copySwapExactETHForTokensTx,
  '0x18cbafe5': copySwapExactTokensForETHTx,
};

// Uniswap V2 Router & ERC20 ABI
const UniswapV2RouterABI = require('./abis/UniswapV2RouterABI.json');
const ERC20ABI = require('./abis/ERC20ABI.json');
const IUniswapV2Router = new ethers.Interface(UniswapV2RouterABI);

// 跟單：swapExactETHForTokens
async function copySwapExactETHForTokensTx(tx) {
  try {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const decoded = IUniswapV2Router.decodeFunctionData(
      'swapExactETHForTokens',
      tx.data
    );

    const ethBalance = await provider.getBalance(wallet.address);
    let txValue = tx.value;
    let amountOutMin = decoded.amountOutMin;
    let deadline = Math.floor(Date.now() / 1000) + 600;

    if (ethBalance <= tx.value) {
      txValue = ethBalance - ethers.parseEther('0.001');
      amountOutMin = (decoded.amountOutMin * txValue) / tx.value;
    }

    return {
      txData: IUniswapV2Router.encodeFunctionData('swapExactETHForTokens', [
        amountOutMin,
        decoded.path,
        wallet.address,
        deadline,
      ]),
      txValue,
    };
  } catch (e) {
    console.error('❌ Error in copySwapExactETHForTokensTx:', e);
  }
}

// 跟單：swapExactTokensForETH
async function copySwapExactTokensForETHTx(tx) {
  try {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const decoded = IUniswapV2Router.decodeFunctionData(
      'swapExactTokensForETH',
      tx.data
    );

    const tokenAddress = decoded.path[0];
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const tokenBalance = await tokenContract.balanceOf(wallet.address);
    let amountIn = decoded.amountIn;

    if (tokenBalance < amountIn) {
      amountIn = tokenBalance;
    }

    // Approve token spending
    const allowance = await tokenContract.allowance(
      wallet.address,
      UNISWAP_V2_ROUTER_ADDRESS
    );
    if (allowance < amountIn) {
      const approveTx = await tokenContract
        .connect(wallet)
        .approve(UNISWAP_V2_ROUTER_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('✅ Approved token spending');
    }

    return IUniswapV2Router.encodeFunctionData('swapExactTokensForETH', [
      amountIn,
      decoded.amountOutMin,
      decoded.path,
      wallet.address,
      Math.floor(Date.now() / 1000) + 600,
    ]);
  } catch (e) {
    console.error('❌ Error in copySwapExactTokensForETHTx:', e);
  }
}
