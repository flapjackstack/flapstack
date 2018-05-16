import { expect } from "chai";
import reducer from "./issues";

const GET_ISSUES = "GET_ISSUES";
const EDIT_ISSUE = "EDIT_ISSUE";
const CREATE_ISSUE = "CREATE_ISSUE";
const ADD_LABEL_TO_ISSUE = "ADD_LABEL_TO_ISSUE";
const REMOVE_LABEL_FROM_ISSUE = "REMOVE_LABEL_FROM_ISSUE";

const load = issues => ({ type: GET_ISSUES, issues });
const edit = issue => ({ type: EDIT_ISSUE, issue });
const create = issue => ({ type: CREATE_ISSUE, issue });
const addLabelToIssue = (issueId, labels) => ({ type: ADD_LABEL_TO_ISSUE, issueId, labels });
const removeLabelFromIssue = (issueId, newLabels) => ({ type: REMOVE_LABEL_FROM_ISSUE, issueId, newLabels });

describe("Issue Reducer", () => {

    const testLabel1 = { id: 1, name: "label1" };
    const testLabel2 = { id: 2, name: "label2" };

    const testIssue0 = {
        id: 1,
        owner: "me",
        repo: "test",
        title: "issue1",
        labels: [testLabel1]
    };

    const testIssue1 = {
        id: 1,
        owner: "me",
        repo: "test",
        title: "a whole new title",
        labels: [testLabel1]
    };

    const testIssue2 = {
        id: 2,
        owner: "me",
        repo: "test",
        title: "issue2",
        labels: [testLabel1]
    };

    const initState = {
        issueList: [testIssue0],
        filter: {}
    };


    it("Loads issues onto state", () => {
        expect(reducer({}, load([testIssue0]))).to.deep.equal({
            filter: {},
            issueList: [
                {
                    id: 1,
                    labels: [
                        {
                            id: 1,
                            name: "label1",
                        }
                    ],
                    owner: "me",
                    repo: "test",
                    title: "issue1"
                }
            ]

        });
    });

    it("Adds an issue to state", () => {
        expect(reducer(initState, create(testIssue2))).to.deep.equal({
            issueList: [
                {
                    id: 1,
                    owner: "me",
                    repo: "test",
                    title: "issue1",
                    labels: [testLabel1]
                },
                {
                    id: 2,
                    owner: "me",
                    repo: "test",
                    title: "issue2",
                    labels: [testLabel1]
                },
            ],
            filter: {}
        });
    });

    it("Edits an issue on state", () => {
        expect(reducer(initState, edit(testIssue1))).to.deep.equal({
            issueList: [
                {
                    id: 1,
                    owner: "me",
                    repo: "test",
                    title: "a whole new title",
                    labels: [testLabel1]
                },
            ],
            filter: {}
        });
    });

    /**
     * This hilariously doesn't add on new labels to the existing labels.  Instead, it replaces all the old labels with the passed-in labels
     */
    it("Adds a label to an issue", () => {
        expect(reducer(initState, addLabelToIssue(1, [testLabel1, testLabel2]))).to.deep.equal({
            issueList: [
                {
                    id: 1,
                    owner: "me",
                    repo: "test",
                    title: "issue1",
                    labels: [testLabel1, testLabel2],
                },
            ],
            filter: {}
        });
    });

    /**
     * This hilariously doesn't remove existing labels.  Instead, it replaces all the old labels with the passed-in labels
     */
    it("Removes a label from an issue", () => {
        expect(reducer(initState, removeLabelFromIssue(1, []))).to.deep.equal({
            issueList: [
                {
                    id: 1,
                    owner: "me",
                    repo: "test",
                    title: "issue1",
                    labels: []
                },
            ],
            filter: {}
        });
    });
});
