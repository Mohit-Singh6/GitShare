const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
    //   console.log("Token: ", token);
      const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret');
      console.log("Decoded JWT Payload: ", decoded);
    
      req.user = {
        user_id: decoded.user_id,
        username: decoded.username
        // Your middleware function (protect) runs before your actual route logic. Inside the middleware, you decode the JWT and prove that the user is valid, extracting their user_id and username.
        // But once next() is called, all the local variables inside your middleware function disappear.
        // By attaching a new object directly onto req.user, you are mutating the request object that is travelling down the highway. Because it's the exact same req object that arrives at your final route handler, your route controller can read it instantly.
      }
      
      next();

    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
