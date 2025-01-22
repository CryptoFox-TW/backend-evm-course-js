class BasicEvmRpc {
  constructor(rpcUrls) {
    this.rpcUrls = rpcUrls;
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async getBlock(blockNumber) {
    return await this.provider.getBlock(blockNumber);
  }

  async getTransaction(txHash) {
    return await this.provider.getTransaction(txHash);
  }

  async getTransactionReceipt(txHash) {
    return await this.provider.getTransactionReceipt(txHash);
  }
}
