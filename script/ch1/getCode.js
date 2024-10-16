import axios from 'axios';

const account = '0xD91A69C3453A884deF888e777cF14652C6a24d9E';

const data = JSON.stringify({
  id: 1,
  jsonrpc: '2.0',
  method: 'eth_getCode',
  params: [account, 'latest'],
});

const config = {
  method: 'post',
  url: 'https://eth.llamarpc.com',
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.error(error);
  });
