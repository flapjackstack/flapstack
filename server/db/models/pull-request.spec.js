const { expect } = require("chai");
const db = require("../db");
const PullRequest = db.model("pull-request");

describe("Issue model", () => {
    beforeEach(() => {
        return db.sync({ force: true });
    });

    describe("Null Value Tests", () => {
        it("Will not create a pull request without being passed a number", async () => {
            try {
                await PullRequest.create();
            } catch (err) {
                expect(err.message).to.be.equal("notNull Violation: pull-request.number cannot be null");
            }
        });
    });
});
