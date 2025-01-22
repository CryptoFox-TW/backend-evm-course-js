const ErrorCode = {
  // General
  UNKNOWN: 10001,

  // Invalid Input
  INVALID_INPUT_PARAM: 10102,

  // Fetch data failed
  TOKEN_NOT_FOUND: 10201,
  PAIR_NOT_FOUND: 10202,
  ASSEST_NOT_FOUND: 10203,

  // Unable to swap
  NOT_ENOUGH_GAS: 10301,
  NOT_ENOUGH_TOKEN: 10302,
  LIQUIDITY_TOO_LOW: 10303,
  SLIPPAGE_CHECK_FAILED: 10304,
  ROUTE_NOT_FOUND: 10305,
};

const ErrorMessage = {
  [ErrorCode.UNKNOWN]: 'Unknown Error',
  [ErrorCode.INVALID_INPUT_PARAM]: 'Invalid Input Parameter',
  [ErrorCode.TOKEN_NOT_FOUND]: 'Token Not Found',
  [ErrorCode.PAIR_NOT_FOUND]: 'Pair Not Found',
  [ErrorCode.ASSEST_NOT_FOUND]: 'Asset Not Found',
  [ErrorCode.NOT_ENOUGH_GAS]: 'Not Enough Gas',
  [ErrorCode.NOT_ENOUGH_TOKEN]: 'Not Enough Token',
  [ErrorCode.LIQUIDITY_TOO_LOW]: 'Liquidity Too Low',
  [ErrorCode.SLIPPAGE_CHECK_FAILED]: 'Slippage Check Failed',
  [ErrorCode.ROUTE_NOT_FOUND]: 'Route Not Found',
};

module.exports = {
  ErrorCode,
  ErrorMessage,
};
