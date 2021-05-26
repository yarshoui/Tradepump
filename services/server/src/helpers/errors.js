const resolveErrorCodeAndMessage = err => {
  let code = 500;
  const message = err.message || 'Internal Server Error';

  if (err.status) {
    code = err.status;
  }
  if (typeof err.code === 'string' && err.code.indexOf('TP') === 0) {
    code = parseInt(err.code.substring(2), 10);
  }
  if (!code) {
    code = 500;
  }

  return [code, message];
};


module.exports = { resolveErrorCodeAndMessage };
