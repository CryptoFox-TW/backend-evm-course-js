const { Context, Next } = require('koa');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger'); // Assuming you have configured winston in ../utils/logger.ts

// Logging middleware to record each request and response
async function RequestLoggerMiddleware(ctx, next) {
  const requestId = uuidv4(); // Generate a unique ID for each request
  const start = Date.now(); // Record the start time of the request

  const method = ctx.method;
  const url = ctx.url;
  const requestParams = JSON.stringify(ctx.request.body || ctx.query);

  try {
    await next(); // Continue to the next middleware

    // Calculate response time
    const responseTime = Date.now() - start;

    // Log format: Method URL - Status - Response Time
    const logMessage = `${method} ${url} - ${ctx.status} - ${responseTime}ms`;

    // Log detailed request and response information
    logger.info(
      `${logMessage} | Request: ${requestParams} | Response: ${JSON.stringify(
        ctx.body
      )}`
    );
  } catch (error) {
    const responseTime = Date.now() - start;

    // Log format: Method URL - Status - Response Time
    const logMessage = `${method} ${url} - ${
      ctx.status || 500
    } - ${responseTime}ms`;

    // Log request and response information in case of an error
    logger.error(
      `${logMessage} | Request: ${requestParams} | Error: ${error.message}`
    );

    throw error; // Re-throw the error to let other middleware handle it
  }
}

module.exports = RequestLoggerMiddleware;
