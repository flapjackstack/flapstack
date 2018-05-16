import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout, fetchPullRequests, me, getRepoInfo } from "../store";
import { Input, Menu, Header, Dropdown, Icon } from "semantic-ui-react";
import styled from "styled-components";
import { default as FilterBox } from "./issues/filter-box";
import { PullRequests } from "./pull-requests";
import { default as AddIssue } from "./issues/add-issue";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadPullRequests();
    this.props.getUserAndProject();
    this.props.fetchRepoInfo();
  }

  render() {
    const { doLogout, className, pullRequests, user, repos } = this.props;
    let logoPic = "";
    if (repos.owner) {
      logoPic = repos.owner.avatar_url;
    }
    return (
      <Menu fixed="top" inverted size="huge" borderless fluid className={className}>
        <Menu.Item>
          <Dropdown
            trigger={<img src={logoPic} width="auto" height="28px" />}
            icon={null}
            pointing="top left">
            <Dropdown.Menu>
              <Dropdown.Header style={{ color: "#C0C0C0" }}>Logged in as {user.username}</Dropdown.Header>
              <Dropdown.Item onClick={doLogout}>Logout</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header style={{ color: "#C0C0C0" }}>
                Currently working on {user.projectName}
              </Dropdown.Header>
              <Dropdown.Item onClick={() => this.props.history.push("/welcome")}>
                Switch To Another Project
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
        <Menu.Item as="a" name="home" onClick={() => this.props.history.push("/")}>
          Home
        </Menu.Item>
        <Menu.Item as="a" name="mockup" onClick={() => this.props.history.push("/mockups")}>
          Mockups
        </Menu.Item>
        <Menu.Item as="a" name="schema" onClick={() => this.props.history.push("/schema")}>
          Schema
        </Menu.Item>
        <Menu.Item as="a" name="board" onClick={() => this.props.history.push("/board")}>
          Board
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <PullRequests allPullRequests={pullRequests} />
          </Menu.Item>
          <Menu.Item>
            <AddIssue />
          </Menu.Item>
          <Menu.Item>
            <FilterBox />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

const StyledNavbar = styled(Navbar)`
  &&& {
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
  }
`;

const mapState = ({ user, issues, pullRequests, repos }) => {
  return { user, issues, pullRequests, repos };
};

const mapDispatch = dispatch => {
  return {
    doLogout(_, { name }) {
      dispatch(logout());
    },
    loadPullRequests() {
      dispatch(fetchPullRequests());
    },
    getUserAndProject() {
      dispatch(me());
    },
    fetchRepoInfo() {
      dispatch(getRepoInfo());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(StyledNavbar));
