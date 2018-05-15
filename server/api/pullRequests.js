const router = require("express").Router();
const { PullRequest } = require("../db/models");
module.exports = router;

/**
 * return all pull requests for a project
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await req.octokit.pullRequests.getAll({
      owner: req.repoOwner,
      repo: req.repoName
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

/**
 * return all pull requests for a project
 */
router.put("/", async (req, res, next) => {
  try {
    const response = await req.octokit.pullRequests.update({
      owner: req.repoOwner,
      repo: req.repoName,
      number: req.body.number,
      title: req.body.title,
      body: req.body.body
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});
