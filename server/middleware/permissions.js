var { expressjwt: jwt } = require('express-jwt');

const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth'
});

const checkPermissions = requiredPermission => {
  return (req, res, next) => {
    const user = req.auth;

    if (user.isAdmin) {
      return next();
    }

    if (user.permissions.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  };
};

module.exports = { jwtMiddleware, checkPermissions };
