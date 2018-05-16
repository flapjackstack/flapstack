import { expect } from "chai";
import reducer from "./labels";

const GET_LABELS = "GET_LABELS";

const load = labels => ({ type: GET_LABELS, labels });

describe("Label Reducer", () => {
    const testLabel = { id: 1, name: "label" };
    const initState = [testLabel];

    it("Loads labels onto state", () => {
        expect(reducer([], load([testLabel]))).to.deep.equal(initState);
    });
});
