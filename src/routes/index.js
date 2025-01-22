const Router = require('koa-router');

const { ErrorCode, CustomError } = require('../errors');
const { Chains } = require('../config');
const axios = require('axios');

const router = new Router();

router.get('/monitor', async (ctx) => {
  ctx.body = {
    message: 'Jianqing is Awesome',
  };
});

router.post('/:method', async (ctx, next) => {
  try {
    const chainId = ctx.request.body.chainId;
    let url = Chains[chainId].ApiServiceUrl + ctx.request.url;

    let response = await axios.post(url, ctx.request.body, {
      headers: { 'Content-Type': 'application/json' },
    });

    ctx.body = response.data;

    next();
  } catch (error) {
    throw CustomError.from(error);
  }
});

module.exports = router;
