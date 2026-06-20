const errorHandler = (err, req, res, next) => {
  console.error('❌ Error Handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Something went wrong!'
  });
};

module.exports = errorHandler;