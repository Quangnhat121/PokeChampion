/**
 * Admin authorization middleware.
 * Must be used AFTER the auth middleware (requires req.user to be set).
 * Returns 403 if the user does not have the 'admin' role.
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Forbidden — admin access required',
    });
  }

  next();
};

export default admin;
