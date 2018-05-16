const { expect } = require("chai");
const db = require("../db");
const Project = db.model("project");

describe("Project Model", () => {
    beforeEach(() => {
        return db.sync({ force: true });
    });

    describe("Null Value Tests", () => {
        it("Will not create a project without being passed both an owner and a repository", async () => {
            try {
                await Project.create();
            } catch (err) {
                expect(err.message).to.be.equal("notNull Violation: project.owner cannot be null,\nnotNull Violation: project.repository cannot be null");
            }
        });

        it("Will not create a project without being passed an owner", async () => {
            try {
                await Project.create({ repository: "demo" });
            } catch (err) {
                expect(err.message).to.be.equal("notNull Violation: project.owner cannot be null");
            }
        });

        it("Will not create a project without being passed a repository", async () => {
            try {
                await Project.create({ owner: "me" });
            } catch (err) {
                expect(err.message).to.be.equal("notNull Violation: project.repository cannot be null");
            }
        });
    });
});
