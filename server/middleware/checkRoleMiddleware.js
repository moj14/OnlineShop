const jsonwt = require("jsonwebtoken");

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        res.status(404).json({ message: "Не авторизован" });
      }
      const decoded = jsonwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json({ message: "No access" });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(404).json({ message: "Не авторизован" });
    }
  };
};
