const errorResponse = require("../utils/errorResponse");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
exports.isAuthorized = async (req, res, next) => {
  // const token = req.cookies.token;
  const token = req.headers.authorization || req.cookies.token;
  // console.log(token);
  if (!token) {
    return next(new errorResponse("you must login", 401));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);
    // req.user = decodedToken;
    next();
  } catch (error) {
    return next(new errorResponse("you must login", 401));
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "user") {
    return next(new errorResponse("Access denied, you must an admin", 401));
  }
  next();
};
