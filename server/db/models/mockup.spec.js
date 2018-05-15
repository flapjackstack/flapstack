const { expect } = require("chai");
const db = require("../db");
const Mockup = db.model("mockup");

describe("Mockup model", () => {
    beforeEach(() => {
        return db.sync({ force: true });
    });

    describe("Default Values", () => {
        let testMockup;

        beforeEach(() => {
            return Mockup.create()
                .then(mockup => {
                    testMockup = mockup;
                });
        });
        it("Name has default value of 'mockup'", () => {
            expect(testMockup.name).to.be.equal("Mockup");
        });

    }); // end describe default values
}); // end describe Mockup model
