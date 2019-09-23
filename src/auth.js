var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
import { prisma } from './generated/prisma-client';

passport.use(
  new GitHubStrategy(
    {
      clientID: '0a73f6b3c7a2a72eb0c2',
      clientSecret: '8ecf6ade70c3768635f21ef6df9a1170b5d28934',
      callbackURL: 'http://localhost:4000/home',
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile._json);
    }
  )
);

passport.serializeUser(async (user, cb) => {
  //create a new user if user does not exist
  console.log('AuthUser', user);
  let findUser = await prisma.users({ where: { githubHandle: user.login } });

  if (findUser.length == 0 || findUser == null || findUser == undefined) {
    const name = user.name.split(' ');
    const firstName = name[0];
    const lastName = name.length > 1 ? name[name.length - 1] : ' ';
    let newUser = await prisma.createUser({
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      githubHandle: user.login,
    });
    console.log('NewUser', newUser);
    cb(null, newUser);
  }

  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});
