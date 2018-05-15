const router = require("express").Router();
const octokit = require("@octokit/rest")();
const { User } = require("../db/models");
module.exports = router;

/**
 * Returns all of a user's public repos not associated with an organization.
 */
router.get("/", async (req, res, next) => {
    try {
        const userObj = await User.findById(req.user.id);
        const token = userObj.token;
        octokit.authenticate({
            type: "oauth",
            token
        });
        const username = userObj.username;
        const result = await octokit.repos.getForUser({ username });
        res.json(result);
    } catch (err) {
        next(err);
    }

});

/**
 * Get all orgs a user is a part of
 */
router.get("/orgs", async (req, res, next) => {
    try {
        const userObj = await User.findById(req.user.id);
        const token = userObj.token;
        octokit.authenticate({
            type: "oauth",
            token
        });
        const result = await octokit.users.getOrgs();
        res.json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Get all repos in a user's organization
 */
router.get("/orgs/:id/repos", async (req, res, next) => {
    try {
        const userObj = await User.findById(req.user.id);
        const token = userObj.token;
        octokit.authenticate({
            type: "oauth",
            token
        });
        const org = req.params.id;
        const result = await octokit.repos.getForOrg({ org });
        res.json(result);
    } catch (err) {
        next(err);
    }
});
