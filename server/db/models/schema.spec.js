const { expect } = require("chai");
const db = require("../db");
const Schema = db.model("schema");

describe("Schema model", () => {
    beforeEach(() => {
        return db.sync({ force: true });
    });

    describe("Null Value Tests", () => {
        it("Will not create a schema without being passed properties", async () => {
            try {
                await Schema.create();
            } catch (err) {
                expect(err.message).to.be.equal("notNull Violation: schema.properties cannot be null");
            }
        });
    });
});
