import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Rnd from "react-rnd";
import { default as ElementLibrary } from "./elements";
import { designerOperations } from "../../store";

class WireframeElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rnd = React.createRef();
  }
  // Handles arrow key nudging events, which come from the parent
  componentWillReceiveProps = props => {
    if (props.selected && this.rnd.current) {
      this.rnd.current.updatePosition({
        x: this.props.element.left + this.props.offset.x,
        y: this.props.element.top + this.props.offset.y
      });
    }
  };

  // We only update the Redux store with the new size or position of an element when the user
  // finishes dragging. React-RnD takes care of keeping track of the element's size and position in
  // the meantime.
  onDragStop = (...args) => {
    const positionInfo = args[1];
    let x = positionInfo.x - this.props.offset.x;
    let y = positionInfo.y - this.props.offset.y;
    x = Math.round(x / 5) * 5; // Round to the nearest 5 for grid snapping
    y = Math.round(y / 5) * 5;
    this.props.doMoveElement(x, y);
  };

  onResizeStop = (...eventArgs) => {
    console.log(eventArgs);
    const sizeDelta = eventArgs[3];
    const coords = eventArgs[4];
    const width = this.props.element.width + sizeDelta.width;
    const height = this.props.element.height + sizeDelta.height;
    this.props.doResizeElement(height, width, coords.x - this.props.offset.x, coords.y - this.props.offset.y);
  };

  onElementClicked = _ => {
    if (!this.props.selected) {
      !this.props.selected && this.props.doSelectElement();
    }
  };

  render() {
    return this.props.selected ? this.renderSelected() : this.renderUnselected();
  }

  // If the element is selected, we wrap the mockup component in a <Rnd> component, which makes
  // whatever component it wraps draggable and resizeable.  After the user stops dragging, we
  // update the Redux store in our event handlers, and we receive new props from our parent, which
  // Rnd uses to set the new default position of the component.
  renderSelected() {
    const { MIN_HEIGHT, MAX_HEIGHT, MIN_WIDTH, MAX_WIDTH } = this.getElementConstraints();
    return (
      <Rnd
        className={this.props.className}
        ref={this.rnd}
        default={{
          x: this.props.element.left + this.props.offset.x,
          y: this.props.element.top + this.props.offset.y,
          width: this.props.element.width,
          height: this.props.element.height
        }}
        z={this.props.element.zIndex}
        bounds={"parent"}
        dragGrid={[5, 5]}
        minHeight={MIN_HEIGHT}
        maxHeight={MAX_HEIGHT}
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
        onDragStop={this.onDragStop}
        onResizeStop={this.onResizeStop}>
        {this.renderElement()}
      </Rnd>
    );
  }

  // If the element isn't selected, we wrap it with a div and pass in style/CSS props received
  // from StyledComponents
  renderUnselected() {
    return (
      <div className={this.props.className} style={this.props.style} onClick={this.onElementClicked}>
        {this.renderElement()}
      </div>
    );
  }

  // We need to associate an Element with an actual React Component, which we can do by using its
  // type property to look it up in the ElementLibrary.  ElementLibrary contains information about
  // all of the different element types, and also has a reference to the appropriate React
  // Component to render.
  renderElement() {
    const ElementToRender = ElementLibrary[this.props.element.type].element.COMPONENT;
    const ClickInterceptor = styled.div`
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: transparent;
    `;
    return (
      // ClickInterceptor is an invisible overlay that stops mouse events, so the user doesn't
      // accidentally click on textboxes or buttons while trying to drag a mockup element around.
      <ClickInterceptor>
        <ElementToRender element={this.props.element} />
      </ClickInterceptor>
    );
  }

  // This is a helper function to grab the min/max size constants for an element, which are static
  // properties defined in the ElementLibrary.
  getElementConstraints() {
    const elementClass = ElementLibrary[this.props.element.type].element;
    return {
      MIN_HEIGHT: elementClass.MIN_HEIGHT,
      MAX_HEIGHT: elementClass.MAX_HEIGHT,
      MIN_WIDTH: elementClass.MIN_WIDTH,
      MAX_WIDTH: elementClass.MAX_WIDTH
    };
  }
}

// StyledComponents warns against putting frequently modified styles (like position while the user
// is dragging an element around) inside of the template string and instead suggests using `attrs`.
const StyledWireframeElement = styled(WireframeElement).attrs({
  style: ({ element, offset }) => ({
    transform: `translate(${element.left + offset.x}px, ${element.top + offset.y}px)`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    zIndex: `${element.zIndex}`
  })
})`
  position: absolute;
  outline: ${({ selected }) => (selected ? "1px solid black" : "none")};
  background-color: ${({ selected }) => (selected ? "#EAEAEA" : "transparent")};
  overflow: hidden;
`;

const mapDispatch = (dispatch, ownProps) => {
  return {
    doSelectElement: () => dispatch(designerOperations.selectElement(ownProps.element)),
    doResizeElement: (height, width, x, y) =>
      dispatch(designerOperations.resizeElement(ownProps.element, { height, width, x, y })),
    doMoveElement: (x, y) => dispatch(designerOperations.moveElement(ownProps.element, { x, y }))
  };
};

export default connect(null, mapDispatch)(StyledWireframeElement);
