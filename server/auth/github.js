const router = require("express").Router();
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const { User } = require("../db/models");
const octokit = require("@octokit/rest")();

const githubCredentials = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK
};

function verificationCallback(token, refreshToken, profile, done) {
  // github may not provide an email, if so we'll just fake it
  const username = profile.username;
  console.log("VerificationCallback", username, token);
  const info = {
    username,
    token
  };

  User.findOrCreate({
    where: { githubId: profile.id },
    defaults: info
  })
    .spread(async user => {
      if (user.token !== token) {
        console.log(`Updating API token for ${user.username}.`);
        user.token = token;
        await user.save();
      }
      done(null, user);
    })
    .catch(done);
}

passport.use(new GitHubStrategy(githubCredentials, verificationCallback));

router.get("/", passport.authenticate("github", { scope: ["repo"] }));

router.get("/verify", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/");
});

router.get("/demo", async (req, res, next) => {
  const demoUser = await User.findById(1);
  demoUser.token = process.env.DEMO_USER_TOKEN;
  demoUser.save();
  req.login(demoUser, () => res.redirect("/"));
});

module.exports = router;
