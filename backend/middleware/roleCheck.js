/**
 * Middleware to restrict access based on user roles
 * @param {Array<string>} allowedRoles - List of roles permitted to access the route
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Assuming the user object is attached to the request by an authentication middleware (e.g., JWT)
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: 'Unauthorized: No user session found'
        });
      }

      if (!user.role) {
        return res.status(403).json({
          message: 'Forbidden: User role not defined'
        });
      }

      console.log(`[ROLE_CHECK] User: ${user.email}, Role: ${user.role}, Allowed: ${allowedRoles}`);
      const hasPermission = allowedRoles.includes(user.role.toLowerCase());

      if (hasPermission) {
        next();
      } else {
        res.status(403).json({
          message: 'Forbidden: You do not have permission to perform this action',
          requiredRoles: allowedRoles,
          yourRole: user.role
        });
      }
    } catch (error) {
      console.error('Role Check Error:', error);
      res.status(500).json({
        message: 'Internal Server Error during role validation'
      });
    }
  };
};

export default roleCheck;
