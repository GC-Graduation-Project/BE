const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    //user == exUser
    done(null, user.id); //유저 id만 추출
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
