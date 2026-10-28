export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
     if(status === 500)
  res.status(status).json({
    error: err.message,
 type: status >= 500 ? 'server error' : 'client error'  });
};