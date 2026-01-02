const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.toLowerCase().startsWith('bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
         return res.status(401).json({ message: 'User no longer exists' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
     if (req.headers.authorization) {
        return res.status(401).json({ message: 'Not authorized, invalid token format. Use: Bearer <token>' });
     }
     res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
