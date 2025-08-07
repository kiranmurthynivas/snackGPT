// Error handling utilities for MCP server

class MCPError extends Error {
  constructor(message, code, data = null) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    this.data = data;
  }
}

// JSON-RPC 2.0 error codes
const ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  SERVER_ERROR_START: -32000,
  SERVER_ERROR_END: -32099
};

function createErrorResponse(id, code, message, data = null) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      data
    }
  };
}

function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err);

  // If response already sent, delegate to default error handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let errorCode = ERROR_CODES.INTERNAL_ERROR;
  let message = 'Internal server error';
  let data = null;

  // Handle different types of errors
  if (err instanceof MCPError) {
    errorCode = err.code;
    message = err.message;
    data = err.data;
    
    // Map MCP error codes to HTTP status codes
    switch (errorCode) {
      case ERROR_CODES.PARSE_ERROR:
      case ERROR_CODES.INVALID_REQUEST:
        statusCode = 400;
        break;
      case ERROR_CODES.METHOD_NOT_FOUND:
        statusCode = 404;
        break;
      case ERROR_CODES.INVALID_PARAMS:
        statusCode = 400;
        break;
      default:
        statusCode = 500;
    }
  } else if (err.name === 'ValidationError') {
    errorCode = ERROR_CODES.INVALID_PARAMS;
    message = 'Validation error';
    data = err.message;
    statusCode = 400;
  } else if (err.name === 'SyntaxError') {
    errorCode = ERROR_CODES.PARSE_ERROR;
    message = 'Parse error';
    statusCode = 400;
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    errorCode = ERROR_CODES.INTERNAL_ERROR;
    message = 'External service unavailable';
    data = 'Failed to connect to AI service';
    statusCode = 503;
  } else if (err.response?.status === 401) {
    errorCode = ERROR_CODES.INTERNAL_ERROR;
    message = 'Authentication failed';
    data = 'Invalid API key';
    statusCode = 401;
  } else if (err.response?.status === 429) {
    errorCode = ERROR_CODES.INTERNAL_ERROR;
    message = 'Rate limit exceeded';
    data = 'Too many requests to AI service';
    statusCode = 429;
  }

  // Check if this is an MCP request
  if (req.path === '/mcp' && req.body && req.body.jsonrpc === '2.0') {
    return res.status(statusCode).json(
      createErrorResponse(req.body.id, errorCode, message, data)
    );
  }

  // Regular HTTP error response
  res.status(statusCode).json({
    error: {
      code: errorCode,
      message,
      data,
      timestamp: new Date().toISOString()
    }
  });
}

function handleAsyncError(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    },
    context
  };

  console.error('Error logged:', JSON.stringify(errorLog, null, 2));
  
  // In production, you might want to send this to a logging service
  // like Winston, Bunyan, or a cloud logging service
}

module.exports = {
  MCPError,
  ERROR_CODES,
  createErrorResponse,
  errorHandler,
  handleAsyncError,
  logError
};
