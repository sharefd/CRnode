const checkPermissions = requiredPermission => {
  return (req, res, next) => {
    const user = req.user;

    if (user.isAdmin) {
      return next();
    }

    if (user.permissions.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
  };
};

module.exports = checkPermissions;
