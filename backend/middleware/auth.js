import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    token = req.header('Authorization')?.replace('Bearer ', '');
  }

  if (!token) {
    console.log(`[AUTH_MIDDLEWARE] No token found in cookies or header for ${req.method} ${req.url}`);
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key_123');
    req.user = decoded;
    console.log(`[AUTH_MIDDLEWARE] Token verified for ${decoded.email || decoded.id} (${decoded.role})`);
    next();
  } catch (err) {
    console.log(`[AUTH_MIDDLEWARE] Token invalid: ${err.message}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
