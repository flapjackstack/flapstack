import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");
import { Button, Header, Input, Modal, Form, Message, Icon, Divider } from "semantic-ui-react";
import "rc-color-picker/assets/index.css";
import ColorPicker from "rc-color-picker";

// react-diagram's DiagramWidget calls a "stopFiringAction" function when the user finishes
// manipulating a diagram element, including after they move an element around.  Because we don't
// otherwise have a proper event listener for node movement, we can hook stopFiringAction

export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeTitle: "Default Model Title",
      nodeColor: "rgb(192,255,0)",
      nodePorts: [],
      linkTitle: "",
      isModalOpen: false,
      linkModalOpen: false,
      nodeTestColor: "rgb(255,255, 255)",
      hideNoTitleWarning: true,
      hideNoLinkTitleWarning: true,
      hideNoPortAmountWarning: true,
      hideNoPortsNamedWarning: true,
      portInputCount: 1
    };

    const oldFunction = DiagramWidget.prototype.stopFiringAction;
    const _self = this;
    DiagramWidget.prototype.stopFiringAction = function(...args) {
      console.log(args);
      oldFunction.apply(this, args);
      props.app.serializerToSchema();
    };
  }

  handleNodeTitleChange = event => {
    this.setState({ nodeTitle: event.target.value });
  };

  handleLinkTitleChange = event => {
    this.setState({ linkTitle: event.target.value });
  };

  cutHex = hexNum => {
    return hexNum.charAt(0) === "#" ? hexNum.substring(1, 7) : hexNum;
  };

  handleNodeColorChange = event => {
    const color = event.color;
    const red = parseInt(this.cutHex(color).substring(0, 2), 16);
    const green = parseInt(this.cutHex(color).substring(2, 4), 16);
    const blue = parseInt(this.cutHex(color).substring(4, 6), 16);
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    this.setState({ nodeColor: rgbColor });
    this.setState({ nodeTestColor: color });
  };

  handlePortSelectChange = event => {
    const numPorts = event.target.value;
    let ports = [];
    for (let i = 1; i <= numPorts; i++) {
      ports.push(i);
    }
    this.setState({ nodePorts: ports });
  };

  onPortInputChange = event => {
    if (event.target.name === `port${this.state.portInputCount - 1}`) {
      console.log("onPortInputChange", event.target.name, this.state.portInputCount);
      this.setState({ portInputCount: this.state.portInputCount + 1 });
      this.forceUpdate();
    }
  };

  linkTitleSumit = () => {
    if (this.state.linkTitle === "") {
      this.setState({ hideNoLinkTitleWarning: false });
      return;
    } else {
      this.setState({ hideNoLinkTitleWarning: true });
    }
    this.closeIn();
    this.addNodeToCanvas();
  };

  nodePortsSubmit = event => {
    event.preventDefault();
    const { nodeTitle, nodePorts } = this.state;
    if (nodeTitle === "") {
      this.setState({ hideNoTitleWarning: false });
      return;
    } else {
      this.setState({ hideNoTitleWarning: true });
    }

    const validPorts = [];
    for (let i = 0; i < this.state.portInputCount; i++) {
      const portName = "port" + i;
      if (event.target[portName] && event.target[portName].value !== "") validPorts.push(event.target[portName].value);
    }
    this.setState({ hideNoPortsNamedWarning: !!validPorts.length });
    if (validPorts.length === 0) return;

    this.setState({ nodePorts: validPorts, open: false });
    this.closeIn();
    this.addNodeToCanvas(validPorts);
  };

  isModalOpen = () => this.setState({ isModalOpen: true });
  closeIn = () => this.setState({ isModalOpen: false, portInputCount: 1 });

  linkModalOpen = () => this.setState({ linkModalOpen: true });
  linkCloseIn = () => this.setState({ linkModalOpen: false });

  renderPortInputs = () => {
    console.log("renderPortInputs", this.state.portInputCount);
    let inputArray = [];
    for (let i = 0; i < this.state.portInputCount; i++) {
      inputArray.push(
        <Form.Group key={`portInput-${i}`} widths="equal">
          <Form.Field>
            <Input fluid label={`Field ${i + 1}`} onChange={this.onPortInputChange} name={`port${i}`} />
          </Form.Field>
        </Form.Group>
      );
    }
    return inputArray;
  };

  render() {
    const { isModalOpen } = this.state;
    return (
      <div className="body">
        <div className="content">
          <TrayWidget>
            <br />
            <Modal
              trigger={
                <Button style={{ backgroundColor: "rgb(192,255,0)", color: "#000000" }}>Add A Model</Button>
              }
              closeIcon
              style={{ width: "400px" }}
              open={isModalOpen}
              onOpen={this.isModalOpen}
              onClose={this.closeIn}>
              <Header icon="block layout" content="Let's Make A Model!" />
              <Modal.Content>
                <Form onSubmit={this.nodePortsSubmit} style={{ margin: "10px" }}>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <Input
                        label="Model Title"
                        onChange={this.handleNodeTitleChange}
                        name="nodeTitle"
                        value={this.state.nodeTitle}
                      />
                    </Form.Field>
                  </Form.Group>
                  {this.renderPortInputs()}
                  <Form.Group>
                    <Form.Field>Model Color</Form.Field>
                    <ColorPicker
                      color={this.state.nodeTestColor}
                      alpha={30}
                      onChange={event => this.handleNodeColorChange(event, "inPort")}
                      placement="topLeft"
                      className="some-class">
                      <span className="rc-color-picker-trigger" />
                    </ColorPicker>
                  </Form.Group>
                  <Form.Button>Submit</Form.Button>
                </Form>
                <Message hidden={this.state.hideNoTitleWarning} attached="bottom" warning>
                  <Icon name="warning sign" />Model must contain a Title
                </Message>
                <Message hidden={this.state.hideNoPortAmountWarning} attached="bottom" warning>
                  <Icon name="warning sign" />Must pick a number of fields.
                </Message>
                <Message hidden={this.state.hideNoPortsNamedWarning} attached="bottom" warning>
                  <Icon name="warning sign" />Must have names for all fields.
                </Message>
              </Modal.Content>
            </Modal>
            <br />
            <br />
            <Modal
              trigger={
                <Button style={{ backgroundColor: "rgb(255,255, 255)", color: "#000000" }}>
                  Add A Link Label
                </Button>
              }
              closeIcon
              open={this.state.linkModalOpen}
              style={{ width: "400px" }}
              onOpen={this.linkModalOpen}
              onClose={this.linkCloseIn}>
              <Modal.Content>
                <Header>Let's Make a Link Label!</Header>
                <Form onSubmit={this.linkTitleSumit} style={{ margin: "10px" }}>
                  <Form.Group widths="equal">
                    <Input
                      label="Link Label"
                      onChange={this.handleLinkTitleChange}
                      name="linkTitle"
                      value={this.state.linkTitle}
                    />
                  </Form.Group>
                  <Form.Button>Submit</Form.Button>
                </Form>
                <Message hidden={this.state.hideNoLinkTitleWarning} attached="bottom" warning>
                  <Icon name="warning sign" />Link must contain a Title
                </Message>
              </Modal.Content>
            </Modal>
          </TrayWidget>
          <div className="diagram-layer">
            <DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
          </div>
        </div>
      </div>
    );
  }

  addNodeToCanvas(newPorts) {
    let node = null;
    if (newPorts) {
      node = new DefaultNodeModel(this.state.nodeTitle, this.state.nodeColor);
      newPorts.map(inPort => {
        node.addInPort(inPort);
        node.addOutPort(" ");
      });
    } else {
      node = new DefaultNodeModel(this.state.linkTitle, this.state.nodeTestColor);
    }
    this.setState({
      nodeTitle: "",
      nodeColor: "",
      linkTitle: "",
      isModalOpen: false,
      linkModalOpen: false,
      nodeTestColor: "rgb(255,255, 255)"
    });
    console.log("node in addNode before listener", node);
    this.props.app.addListenersOnNode(node);
    console.log("node in addNode AFTER listener", node);
    this.props.app
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    this.props.app.serializerToSchema();
  }
}
