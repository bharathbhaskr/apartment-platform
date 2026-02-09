const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  //console.log("REACHED HERE MIDDLEWARE")
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.userId = decoded.userID; // Attach the decoded user ID to the request object
    console.log("Decoded ", decoded.userID)
    console.log("Req id" , req.userId);
    next();
  });
};

module.exports = verifyToken;
