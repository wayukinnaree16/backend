const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');
const { supabase } = require('../../config/supabase.config');
const asyncHandler = require('../../utils/asyncHandler');

const protectRoute = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized to access this route, no token provided'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', decoded.user_id)
      .single();

    if (error || !user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized to access this route, user not found'));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Not authorized to access this route, token failed'));
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.user_type)) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          `User role ${req.user ? req.user.user_type : 'guest'} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

module.exports = { protectRoute, authorize }; 