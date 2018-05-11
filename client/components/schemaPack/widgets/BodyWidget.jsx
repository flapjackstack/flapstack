import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");
import { Button, Header, Input, Modal, Form } from "semantic-ui-react";
import "rc-color-picker/assets/index.css";
import ColorPicker from "rc-color-picker";

export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeTitle: "Default Model Title",
      nodeColor: "rgb(192,255,0)",
      nodePorts: [],
      isModalOpen: false,
      nodeTestColor: "#ff0000"
    };
  }

  handleNodeTitleChange = event => {
    this.setState({ nodeTitle: event.target.value });
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

  nodePortsSubmit = event => {
    event.preventDefault();
    if (
      !this.state.nodeTitle ||
      !this.state.nodeColor ||
      this.state.nodePorts.length === 0
      // !this.state.nodePorts.every(port => typeof port === "string")
    ) {
      alert("PLEASE FILL IN ALL THE FORM FIELDS!");
    }
    let newPorts = [];
    for (let i = 1; i <= this.state.nodePorts.length; i++) {
      const portName = "port" + i;
      if (!event.target[portName]) {
        alert("PLEASE FILL IN ALL IN PORT NAME BOXES");
      } else {
        newPorts.push(event.target[portName].value);
      }
    }
    this.setState({ nodePorts: newPorts, open: false });
    this.closeIn();
    this.addNodeToCanvas(newPorts);
  };

  isModalOpen = () => this.setState({ isModalOpen: true });
  closeIn = () => this.setState({ isModalOpen: false });

  render() {
    const { isModalOpen, openOut } = this.state;
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
                    <Input
                      label="Model Title"
                      onChange={this.handleNodeTitleChange}
                      name="nodeTitle"
                      value={this.state.nodeTitle}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Field>Model Fields</Form.Field>
                    <Form.Field
                      control="select"
                      onChange={event => this.handlePortSelectChange(event, "inPort")}>
                      <option value="" />
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Field>
                  </Form.Group>
                  {this.state.nodePorts.map(portNum => {
                    return <Input key={portNum} placeholder="Field Name Here" name={`port${portNum}`} />;
                  })}
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
              </Modal.Content>
            </Modal>
            <br />
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
    node = new DefaultNodeModel(this.state.nodeTitle, this.state.nodeColor);
    newPorts.map(inPort => {
      node.addInPort(inPort);
      node.addOutPort(" ");
    });
    this.setState({
      nodeTitle: "",
      nodeColor: "",
      isModalOpen: false,
      nodeTestColor: "#ff0000"
    });
    this.props.app.addListenersOnNode(node);
    this.props.app
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    this.props.app.updateSchema();
  }
}
