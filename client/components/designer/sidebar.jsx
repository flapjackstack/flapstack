import React from "react";
import { DesignerToolbox, DesignerProperties } from "./index";
import { connect } from "react-redux";
import { Issues } from "../";
import { Tab } from "semantic-ui-react";
import { default as styled } from "styled-components";

const DesignerSidebar = props => {
  const panes = [
    {
      menuItem: "Issues",
      render: () => (
        <Tab.Pane attached={false}>
          <Issues />
        </Tab.Pane>
      )
    }
  ];
  if (props.areElementsSelected) {
    panes.push({
      menuItem: "Properties",
      render: () => (
        <Tab.Pane attached={false}>
          <DesignerProperties />
        </Tab.Pane>
      )
    });
  } else {
    panes.push({
      menuItem: "Components",
      render: () => (
        <Tab.Pane attached={false}>
          <DesignerToolbox />
        </Tab.Pane>
      )
    });
  }

  return (
    <Wrapper>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* padding-right: 10px; */
`;

const mapState = state => ({ areElementsSelected: state.designer.selectedElements.length });

export default connect(mapState, null)(DesignerSidebar);
