const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const authtoken = req.headers.authorization;
  if (authtoken) {
    const token = authtoken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(404).json({ message: "invalid token" });
    }
  } else {
    return res.status(404).json({ message: "no token provided" });
  }
}

function verifyAdminToken(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
        next()
    } else {
      return res.status(401).json({ message: "access denied" });
    }
  });
}

function verifyUserToken(req, res, next) {
    verifyToken(req, res, () => {
      if (req.user.id===req.params.id) {
          next()
      } else {
        return res.status(401).json({ message: "access denied" });
      }
    });
  }

  function verifyUserorAdminToken(req, res, next) {
    verifyToken(req, res, () => {
      if (req.user.id===req.params.id || req.user.isAdmin) {
          next()
      } else {
        return res.status(401).json({ message: "access denied" });
      }
    });
  }
module.exports = {
  verifyToken,
  verifyAdminToken,
  verifyUserToken,
  verifyUserorAdminToken
};
