const { expect } = require("chai");
const db = require("../db");
const Issue = db.model("issue");

describe("Issue model", () => {
    beforeEach(() => {
        return db.sync({ force: true });
    });

    describe("Honestly, this test is pretty mindless...", () => {
        describe("has the number you told it to have", () => {
            let testIssue;
            beforeEach(() => {
                return Issue.create({ number: 1 })
                    .then(issue => {
                        testIssue = issue;
                    });
            });

            it("Makes sure it's number property is the same number property you used when you created it", () => {
                expect(testIssue.number).to.be.equal(1);
            });
        });
    });
});
