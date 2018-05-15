const router = require("express").Router();
const { Schema } = require("../db/models");
module.exports = router;

/**
 * return all schema properties for a project
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await Schema.findOne({
      where: {
        projectId: req.user.activeProjectId
      }
    });
    if (!response) return;
    res.json(response.properties);
  } catch (err) {
    next(err);
  }
});

/**
 * post new properties for specific schema into database
 *
 */
router.post("/", async (req, res, next) => {
  try {
    // returns created issue object
    const response = await Schema.create({
      properties: req.body.properties,
      projectId: req.user.activeProjectId
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

/**
 * updates schema
 * need to use assignee method for issue
 */
router.put("/", async (req, res, next) => {
  try {
    // returns created issue object
    const response = await Schema.update(
      {
        properties: req.body.properties
      },
      {
        where: {
          projectId: req.user.activeProjectId
        },
        returning: true
      }
    );
    res.json(response[1]);
  } catch (err) {
    next(err);
  }
});
