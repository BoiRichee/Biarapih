const errorHandler = (err, req, res, next) => {
    let message = "Internal Server Error";
    let status = 500;
  
    if (err.name === "Unauthorized" || err.name === "JsonWebTokenError") {
      status = 401;
      message = "Invalid Token";
    } else if (err.name === "notFound") {
      status = 404;
      message = "error not found";
    } else if (err.name === "Forbidden") {
      status = 403;
      message = "You don't have permission";
    } else if (err.name === "SequelizeValidationError") {
      (status = 400), (message = err.errors[0].message);
    } else if (err.name === "emailRequired") {
      status = 400;
      message = "Email is required";
    } else if (err.name === "passwordRequired") {
      status = 400;
      message = "Password is required";
    } else if (err.name === "unauthenticade") {
      status = 401;
      message = "Invalid email or password";
    } else if (err.name === "SequelizeUniqueConstraintError") {
      status = 400;
      message = err.errors[0].message;
    } else if (err.name === "imageUrlRequired") {
      status = 400;
      message = "ImageUrl is required";
    }
  
    res.status(status).json({
      message,
    });
  };
  
  module.exports = errorHandler;