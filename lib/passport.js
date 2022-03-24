const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models").UserGame;

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let data = req?.cookies["jwt"];
      console.log("cek ini", data);
      if (!data) {
        return null;
      }
      return data;
    },
  ]),
  secretOrKey: "This is Secret",
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    User.findByPk(payload.id)
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  })
);

module.exports = passport;
