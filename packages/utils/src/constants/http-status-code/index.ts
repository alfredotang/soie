export const HTTP_STATUS_DICT = [
  {
    code: 100,
    name: 'CONTINUE',
    description: 'Continue',
  },
  {
    code: 101,
    name: 'SWITCHING_PROTOCOLS',
    description: 'Switching Protocols',
  },
  {
    code: 102,
    name: 'PROCESSING',
    description: 'Processing',
  },
  {
    code: 103,
    name: 'EARLY_HINTS',
    description: 'Early Hints',
  },
  {
    code: 200,
    name: 'OK',
    description: 'OK',
  },
  {
    code: 201,
    name: 'CREATED',
    description: 'Created',
  },
  {
    code: 202,
    name: 'ACCEPTED',
    description: 'Accepted',
  },
  {
    code: 203,
    name: 'NON_AUTHORITATIVE_INFORMATION',
    description: 'Non Authoritative Information',
  },
  {
    code: 204,
    name: 'NO_CONTENT',
    description: 'No Content',
  },
  {
    code: 205,
    name: 'RESET_CONTENT',
    description: 'Reset Content',
  },
  {
    code: 206,
    name: 'PARTIAL_CONTENT',
    description: 'Partial Content',
  },
  {
    code: 207,
    name: 'MULTI_STATUS',
    description: 'Multi-Status',
  },
  {
    code: 300,
    name: 'MULTIPLE_CHOICES',
    description: 'Multiple Choices',
  },
  {
    code: 301,
    name: 'MOVED_PERMANENTLY',
    description: 'Moved Permanently',
  },
  {
    code: 302,
    name: 'MOVED_TEMPORARILY',
    description: 'Moved Temporarily',
  },
  {
    code: 303,
    name: 'SEE_OTHER',
    description: 'See Other',
  },
  {
    code: 304,
    name: 'NOT_MODIFIED',
    description: 'Not Modified',
  },
  {
    code: 307,
    name: 'TEMPORARY_REDIRECT',
    description: 'Temporary Redirect',
  },
  {
    code: 308,
    name: 'PERMANENT_REDIRECT',
    description: 'Permanent Redirect',
  },
  {
    code: 400,
    name: 'BAD_REQUEST',
    description: 'Bad Request',
  },
  {
    code: 401,
    name: 'UNAUTHORIZED',
    description: 'Unauthorized',
  },
  {
    code: 402,
    name: 'PAYMENT_REQUIRED',
    description: 'Payment Required',
  },
  {
    code: 403,
    name: 'FORBIDDEN',
    description: 'Forbidden',
  },
  {
    code: 404,
    name: 'NOT_FOUND',
    description: 'Not Found',
  },
  {
    code: 405,
    name: 'METHOD_NOT_ALLOWED',
    description: 'Method Not Allowed',
  },
  {
    code: 406,
    name: 'NOT_ACCEPTABLE',
    description: 'Not Acceptable',
  },
  {
    code: 407,
    name: 'PROXY_AUTHENTICATION_REQUIRED',
    description: 'Proxy Authentication Required',
  },
  {
    code: 408,
    name: 'REQUEST_TIMEOUT',
    description: 'Request Timeout',
  },
  {
    code: 409,
    name: 'CONFLICT',
    description: 'Conflict',
  },
  {
    code: 410,
    name: 'GONE',
    description: 'Gone',
  },
  {
    code: 411,
    name: 'LENGTH_REQUIRED',
    description: 'Length Required',
  },
  {
    code: 412,
    name: 'PRECONDITION_FAILED',
    description: 'Precondition Failed',
  },
  {
    code: 413,
    name: 'REQUEST_TOO_LONG',
    description: 'Request Entity Too Large',
  },
  {
    code: 414,
    name: 'REQUEST_URI_TOO_LONG',
    description: 'Request-URI Too Long',
  },
  {
    code: 415,
    name: 'UNSUPPORTED_MEDIA_TYPE',
    description: 'Unsupported Media Type',
  },
  {
    code: 416,
    name: 'REQUESTED_RANGE_NOT_SATISFIABLE',
    description: 'Requested Range Not Satisfiable',
  },
  {
    code: 417,
    name: 'EXPECTATION_FAILED',
    description: 'Expectation Failed',
  },
  {
    code: 418,
    name: 'IM_A_TEAPOT',
    description: "I'm a teapot",
  },
  {
    code: 419,
    name: 'INSUFFICIENT_SPACE_ON_RESOURCE',
    description: 'Insufficient Space on Resource',
  },
  {
    code: 421,
    name: 'MISDIRECTED_REQUEST',
    description: 'Misdirected Request',
  },
  {
    code: 422,
    name: 'UNPROCESSABLE_ENTITY',
    description: 'Unprocessable Entity',
  },
  {
    code: 423,
    name: 'LOCKED',
    description: 'Locked',
  },
  {
    code: 424,
    name: 'FAILED_DEPENDENCY',
    description: 'Failed Dependency',
  },
  {
    code: 426,
    name: 'UPGRADE_REQUIRED',
    description: 'Upgrade Required',
  },
  {
    code: 428,
    name: 'PRECONDITION_REQUIRED',
    description: 'Precondition Required',
  },
  {
    code: 429,
    name: 'TOO_MANY_REQUESTS',
    description: 'Too Many Requests',
  },
  {
    code: 431,
    name: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    description: 'Request Header Fields Too Large',
  },
  {
    code: 451,
    name: 'UNAVAILABLE_FOR_LEGAL_REASONS',
    description: 'Unavailable For Legal Reasons',
  },
  {
    code: 500,
    name: 'INTERNAL_SERVER_ERROR',
    description: 'Internal Server Error',
  },
  {
    code: 501,
    name: 'NOT_IMPLEMENTED',
    description: 'Not Implemented',
  },
  {
    code: 502,
    name: 'BAD_GATEWAY',
    description: 'Bad Gateway',
  },
  {
    code: 503,
    name: 'SERVICE_UNAVAILABLE',
    description: 'Service Unavailable',
  },
  {
    code: 504,
    name: 'GATEWAY_TIMEOUT',
    description: 'Gateway Timeout',
  },
  {
    code: 505,
    name: 'HTTP_VERSION_NOT_SUPPORTED',
    description: 'HTTP Version Not Supported',
  },
  {
    code: 507,
    name: 'INSUFFICIENT_STORAGE',
    description: 'Insufficient Storage',
  },
  {
    code: 511,
    name: 'NETWORK_AUTHENTICATION_REQUIRED',
    description: 'Network Authentication Required',
  },
] as const

export type HttpStatus = (typeof HTTP_STATUS_DICT)[number]

export const STATUS_CODE_DICT = HTTP_STATUS_DICT.reduce(
  (collection, { code, description }) => {
    collection[code] = description
    return collection
  },
  {} as Record<HttpStatus['code'], HttpStatus['description']>
)

export const STATUS_DESCRIPTION_DICT = HTTP_STATUS_DICT.reduce(
  (collection, { name, code }) => {
    collection[name] = code
    return collection
  },
  {} as Record<HttpStatus['name'], HttpStatus['code']>
)
