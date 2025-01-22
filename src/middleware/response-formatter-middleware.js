const { Context, Next } = require('koa');

const { CustomError } = require('../errors');

async function ResponseFormatterMiddleware(ctx, next) {
  try {
    await next();
  } catch (error) {
    let isCustomError = error instanceof CustomError;

    ctx.status = 200;
    ctx.body = {
      code: isCustomError ? error.code : CustomError.getUnknowErrorCode(),
      message: error.getMessage(),
    };
  }
}

module.exports = ResponseFormatterMiddleware;
