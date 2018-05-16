import { expect } from "chai";
import reducer from "./collaborators";

describe("Collaborator Reducer", () => {
    it("Should return all collaborators", () => {
        expect(reducer(["me", "myself", "I"], "GET_COLLABORATORS")).to.deep.equal(["me", "myself", "I"]);
    });
})
    ;
