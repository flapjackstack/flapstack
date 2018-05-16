import axios from "axios";
import { combineReducers } from "redux";

/**
 * ACTION TYPES
 */
const GET_ISSUES = "GET_ISSUES";
const EDIT_ISSUE = "EDIT_ISSUE";
const CREATE_ISSUE = "CREATE_ISSUE";
const ADD_LABEL_TO_ISSUE = "ADD_LABEL_TO_ISSUE";
const REMOVE_LABEL_FROM_ISSUE = "REMOVE_LABEL_FROM_ISSUE";
const RESET = "RESET";

// Filter
const SET_ISSUE_FILTER = "SET_ISSUE_FILTER";

/**
 * ACTION CREATORS
 */
const load = issues => ({ type: GET_ISSUES, issues });
const edit = issue => ({ type: EDIT_ISSUE, issue });
const create = issue => ({ type: CREATE_ISSUE, issue });
const addLabelToIssue = (issueId, labels) => ({ type: ADD_LABEL_TO_ISSUE, issueId, labels });
const removeLabelFromIssue = (issueId, newLabels) => ({ type: REMOVE_LABEL_FROM_ISSUE, issueId, newLabels });
const reset = () => ({ type: RESET });

export const setIssueFilter = filter => {
  return { type: SET_ISSUE_FILTER, filter };
};

/**
 * REDUCER
 */
const issueListReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ISSUES:
      return action.issues;

    case EDIT_ISSUE:
      return state.map(issue => {
        if (action.issue.id === issue.id) return action.issue;
        return issue;
      });

    case CREATE_ISSUE:
      return [...state, action.issue];

    case ADD_LABEL_TO_ISSUE:
      return state.map(issue => {
        if (action.issueId === issue.id) return { ...issue, labels: action.labels };
        return issue;
      });

    case REMOVE_LABEL_FROM_ISSUE:
      return state.map(issue => {
        if (action.issueId === issue.id) return { ...issue, labels: action.newLabels };
        return issue;
      });

    case RESET:
      return undefined;

    default:
      return state;
  }
};

const issueFilterReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ISSUE_FILTER:
      return action.filter;
    default:
      return state;
  }
};

export default combineReducers({
  issueList: issueListReducer,
  filter: issueFilterReducer
});

/**
 * THUNK CREATORS
 */
export const fetchIssues = () => dispatch =>
  axios
    .get("/api/issues")
    .then(res => dispatch(load(res.data)))
    .catch(err => console.error("Fetching issues unsuccessful", err));

export const editIssue = issue => dispatch =>
  axios
    .put(`/api/issues/${issue.number}`, issue)
    .then(res => dispatch(edit(res.data)))
    .catch(err => console.error(`Updating issue ${issue.number} unsuccessful`, err));

export const createIssue = issue => dispatch =>
  axios
    .post("/api/issues", issue)
    .then(res => dispatch(create(res.data)))
    .catch(err => console.error("Creating issue unsuccessful", err));

export const addLabel = (issue, labels) => dispatch =>
  axios
    .post(`/api/issues/${issue.number}/labels`, labels)
    .then(res => dispatch(addLabelToIssue(issue.id, res.data)))
    .catch(err => console.error("Adding label unsuccessful", err));

export const removeLabel = (issue, labelname) => dispatch =>
  axios
    .delete(`/api/issues/${issue.number}/labels/${labelname}`)
    .then(res => dispatch(removeLabelFromIssue(issue.id, res.data)))
    .catch(err => console.error("Removing label unsuccessful", err));
