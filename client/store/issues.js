import axios from "axios";
import { combineReducers } from "redux";

/**
 * ACTION TYPES
 */
const GET_ISSUES = "GET_ISSUES";
const EDIT_ISSUE = "EDIT_ISSUE";
const CREATE_ISSUE = "CREATE_ISSUE";


// Filter
const SET_ISSUE_FILTER = "SET_ISSUE_FILTER";

/**
 * ACTION CREATORS
 */
const load = issues => ({ type: GET_ISSUES, issues });
const edit = issue => ({ type: EDIT_ISSUE, issue });

export const setIssueFilter = filter => ({ type: SET_ISSUE_FILTER, filter });

/**
 * REDUCER
 */
const issueListReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ISSUES:
      return action.issues;

    case EDIT_ISSUE:
      console.log("ACTION", action);
      return state.map(issue => {
        if (action.issue.id === issue.id) return action.issue;
        return issue;
      });

    default:
      return state;
  }
};

const issueFilterReducer = (state = "", action) => {
  switch (action.type) {
    case SET_ISSUE_FILTER:
      return action.filter.toLowerCase();
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

export const editIssue = issue => dispatch => {
  console.log("issue", issue);
  axios
    .put(`/api/issues/${issue.number}`, issue)
    .then(res => dispatch(edit(res.data)))
    .catch(err => console.error(`Updating issue ${issue.number} unsuccessful`, err));
};
