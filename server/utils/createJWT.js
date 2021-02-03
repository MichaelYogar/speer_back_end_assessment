const jwt = require("jsonwebtoken");
require("dotenv").config();

// payload contains verifiable security statements, such as the identity of the user and the permissions they are allowed
// cannot store sensitive info in payload
// in this case, payload only needs user_id
const createJWT = (user_id) => {
  const payload = {
    user: {
      id: user_id,
    },
  };

  // expiresIn: 60 * 60
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = createJWT;
