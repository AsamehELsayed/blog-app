const notfound = (req, res, next) => {
    const error = new Error(`not found page ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ error: { message: err.message } });
    // يمكنك أيضاً إرسال الخطأ إلى خدمة مراقبة الأخطاء أو تسجيله في الخادم.
  };
  
  module.exports = {
    notfound,
    errorHandler
  };