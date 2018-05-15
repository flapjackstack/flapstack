const router = require("express").Router();
const { User, Project, Mockup, Schema } = require("../db/models");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    const project = await Project.findOrCreate({
      where: {
        owner: req.body.owner,
        repository: req.body.repository
      }
    });
    const currentUser = await User.findById(req.user.id);
    await currentUser.setActiveProject(project[0].id);
    await currentUser.addProject(project[0]);

    const mockups = await Mockup.count({ where: { projectId: req.user.activeProjectId } });
    if (!mockups) {
      await Mockup.create({
        name: "Mockup 1",
        projectId: project[0].id
      });
    }
    await Schema.upsert(
      { projectId: req.user.activeProjectId, properties: "" },
      { where: { projectId: req.user.activeProjectId } }
    );

    res.json(project[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/mockups", async (req, res, next) => {
  try {
    const mockupList = await Mockup.findAll({ where: { projectId: req.user.activeProjectId } });
    res.json(mockupList);
  } catch (error) {
    next(error);
  }
});

router.post("/mockups", async (req, res, next) => {
  try {
    const newMockup = Mockup.build({
      name: req.body.name,
      projectId: req.user.activeProjectId
    });
    res.status(201).json(await newMockup.save());
  } catch (error) {
    next(error);
  }
});

router.delete("/mockups/:id", async (req, res, next) => {
  try {
    await Mockup.destroy({ where: { id: req.params.id, projectId: req.user.activeProjectId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.put("/mockups/:id", async (req, res, next) => {
  try {
    const updatedMockup = await Mockup.update(
      { name: req.body.name },
      { where: { id: req.params.id, projectId: req.user.activeProjectId } }
    );
    res.json(updatedMockup);
  } catch (error) {
    next(error);
  }
});
