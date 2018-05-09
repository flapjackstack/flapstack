import React, { Component } from "react";
import { Navbar, Sidebar, DesignerCanvas, DesignerSidebar, Schema, SocketModal, MockupList } from "./index";
import { connect } from "react-redux";
import { withRouter, Switch, Route } from "react-router-dom";
import { fetchIssues } from "../store";
import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadIssues();
  }

  render() {
    return (
      <StyledAppWrapper>
        <Grid style={{ paddingTop: "0px" }}>
          <Grid.Row>
            <Navbar />
          </Grid.Row>
          <Route path="/wireframes" component={SocketModal} />
          <Grid.Row>
            <Grid.Column id="main">
              <Switch>
                <Route path="/mockups" component={MockupList} />
                <Route path="/wireframes" component={DesignerCanvas} />
                <Route path="/schema" component={Schema} />
                <Route
                  render={() => (
                    <div>
                      <h2>No matching route</h2>
                    </div>
                  )}
                />
              </Switch>
            </Grid.Column>
            <Grid.Column id="sidebar">
              <Switch>
                {/* <Route path="/wireframes" component={DesignerProperties} /> */}
                <Route path="/wireframes" component={DesignerSidebar} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </StyledAppWrapper>
    );
  }
}

const StyledAppWrapper = styled.div`
  #main {
    position: fixed;
    top: 60px;
    height: 100%;
    width: calc(100% - 260px);
    overflow: hidden;
  }

  #sidebar {
    position: fixed;
    background: white;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 300px;
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
    padding-right: 0px;
  }

  scroll-container {
    display: block;
    width: 400px;
    height: 600px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
`;

const mapDispatch = dispatch => {
  return {
    loadIssues() {
      dispatch(fetchIssues());
    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
