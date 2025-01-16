const jwt = require("jsonwebtoken");
//extract the jwt token from request headers

const jwttokenmiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "Token not found" });
  }

  const token = auth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode; // Add the decoded token payload to the request
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = jwttokenmiddleware;

//generate the token
const generatetoken = (userdata) => {
  return jwt.sign(userdata, process.env.JWT_SECRET);
};
module.exports = { jwttokenmiddleware, generatetoken };
