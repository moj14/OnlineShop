const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User, Basket } = require("../models/models");
const jsonwt = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
  return jsonwt.sign({ id: id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registraion(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Incorrect email or pass"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("User already registered"));
    }
    const hashpassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashpassword });
    const basket = await Basket.create({ userId: user.id });
    const jwt = generateJwt(user.id, user.email, user.role);
    console.log(jwt);
    return res.json(jwt);
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.badRequest("Пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest("Пользователь password incorrect"));
    }
    return res.json(generateJwt(user.id, user.email, user.role));
  }

  async check(req, res, next) {
    
    const jwt = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ jwt });
  }
}

module.exports = new UserController();
