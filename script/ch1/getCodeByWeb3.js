require('dotenv').config();
const { Printer } = require('../../src/utils');
const { Web3 } = require('web3');
const web3 = new Web3(process.env.MAINNET_INFURA_URL);

const eoaAddress = '0x6A4481Eb81B9772b992aE58c429d508F5273b823';
const contractAddress = '0xD91A69C3453A884deF888e777cF14652C6a24d9E';

async function getCode(address) {
  const code = await web3.eth.getCode(address);
  return code;
}

(async () => {
  const eoaAddressCode = await getCode(eoaAddress);
  const contractAddressCode = await getCode(contractAddress);

  Printer.print('Codes:', {
    eoaAddressCode,
    contractAddressCode,
  });
})();
