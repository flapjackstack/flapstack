import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Grid, Icon, Input, List, Message, Modal, Radio, Select } from "semantic-ui-react";

import { AssigneeLabel, LabelLabel } from "./index";
import { editIssue } from "../../store/issues";

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAssignee: "",
            selectedLabel: "",
            hideNoBodyWarning: true,
            hideNoTitleWarning: true,
            modalOpen: false,
        };
    }

    componentDidMount = () => {
        const { title, body, state, assignees, labels, id, number } = this.props.activeIssue;
        const assigneeLogins = assignees.map(assignee => assignee.login);
        const labelNames = labels.map(label => label.name);
        this.setState({
            title,
            body,
            state,
            assignees: assigneeLogins,
            labels: labelNames,
            id,
            number,
            hideNoBodyWarning: true,
            hideNoTitleWarning: true,
            modalOpen: false,
        });
    }

    handleChange = (evt, { name, value }) => { this.setState({ [name]: value }); }

    openModal = () => {
        this.setState({ modalOpen: true });
    }

    closeModal = () => {
        this.setState({ modalOpen: false });
    }

    findUnassignedCollabs = (assignedCollabs, allCollabs) => {
        if (!assignedCollabs) return allCollabs;
        let result = [];
        let found = false;
        for (let i = 0; i < allCollabs.length; i++) {
            found = false;
            for (let j = 0; j < assignedCollabs.length; j++) {
                if (allCollabs[i].login === assignedCollabs[j]) found = true;
            }
            if (!found) result.push(allCollabs[i]);
        }
        return result;
    }

    findUnnassignedLabels = (assignedLabels, allLabels) => {
        if (!assignedLabels) return allLabels;
        let result = [];
        let found = false;
        for (let i = 0; i < allLabels.length; i++) {
            found = false;
            for (let j = 0; j < assignedLabels.length; j++) {
                if (allLabels[i].name === assignedLabels[j]) found = true;
            }
            if (!found) result.push(allLabels[i]);
        }
        return result;
    }

    addAssignee = () => {
        if (this.state.selectedAssignee) {
            const assignees = [...this.state.assignees, this.state.selectedAssignee];
            this.setState({ assignees, selectedAssignee: "" });
        }

    }

    addLabel = () => {
        if (this.state.selectedLabel) {
            const labels = [...this.state.labels, this.state.selectedLabel];
            this.setState({ labels, selectedLabel: "" });
        }
    }

    openState = () => { this.setState({ state: "open" }); }

    closeState = () => { this.setState({ state: "closed" }); }

    handleSubmit = () => {
        const { title, body, state, labels, assignees, number } = this.state;
        let goodSubmit = true;
        if (title === "") {
            this.setState({ hideNoTitleWarning: false });
            goodSubmit = false;
        }
        if (body === "") {
            this.setState({ hideNoBodyWarning: false });
            goodSubmit = false;
        }

        if (!goodSubmit) return;

        this.props.editIssue({ title, body, state, labels, assignees, number });
        this.closeModal();
    }

    render() {
        const collabOptions = this.findUnassignedCollabs(this.state.assignees, this.props.collaborators)
            .map(collab => ({
                key: collab.id,
                text: collab.login,
                image: collab.avatar_url,
                value: collab.login
            }));
        const labelOptions = this.findUnnassignedLabels(this.state.labels, this.props.labels)
            .map(label => ({
                key: label.id,
                text: label.name,
                value: label.name,
            }));
        return (
            <List.Item>
                <Modal trigger={<Button onClick={this.openModal} fluid>{this.state.title}</Button>} open={this.state.modalOpen}>
                    <Modal.Content>
                        <h1>Issue #{this.state.number}</h1>
                        <Divider />

                        {/* Edit Title */}
                        <Input fluid name="title" label="Title" onChange={this.handleChange} placeholder="Enter Title" value={this.state.title} />
                        <Message hidden={this.state.hideNoTitleWarning} attached="bottom" warning><Icon name="warning sign" />Issue must contain a Title</Message>

                        <Divider hidden />

                        {/* Edit Body */}
                        <Input fluid name="body" label="Body" onChange={this.handleChange} placeholder="Enter Body" value={this.state.body} />
                        <Message hidden={this.state.hideNoBodyWarning} attached="bottom" warning><Icon name="warning sign" />Issue must contain a body</Message>

                        <Divider hidden />

                        {/* Select State */}
                        <Radio label="Open" checked={this.state.state === "open"} style={{ marginRight: "10px" }} onClick={this.openState} />
                        <Radio label="Closed" checked={this.state.state === "closed"} onClick={this.closeState} />

                        <Divider hidden />
                        <Grid divided columns="equal">
                            <Grid.Row>
                                <Grid.Column>
                                    {/* Select Assignee */}
                                    <Select name="selectedAssignee" label="Assignees" onChange={this.handleChange} options={collabOptions} placeholder="Select Assignees" />
                                    <Button icon onClick={this.addAssignee}><Icon name="add" /></Button>

                                </Grid.Column>
                                <Grid.Column>
                                    {/* Select Label */}
                                    <Select name="selectedLabel" label="Add Labels" onChange={this.handleChange} options={labelOptions} placeholder="Select Labels" />
                                    <Button icon onClick={this.addLabel}><Icon name="add" /></Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    {/* Assignee List */}
                                    {this.state.assignees
                                        ? this.state.assignees.map(login => <AssigneeLabel key={login} login={login} />)
                                        : <div />}
                                </Grid.Column>
                                <Grid.Column>
                                    {/* Label List */}
                                    {this.state.labels
                                        ? this.state.labels.map(name => <LabelLabel key={name} name={name} />)
                                        : <div />}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider />
                        <Modal.Actions>
                            {/* Submit Button */}
                            <Button color="green" onClick={this.handleSubmit}><Icon name="checkmark" /> Submit</Button>
                            {/* Cancel Button */}
                            <Button color="red" onClick={this.closeModal}><Icon name="checkmark" /> Cancel</Button>
                        </Modal.Actions>
                    </Modal.Content>
                </Modal>
            </List.Item>
        );
    }
}

const mapState = ({ issues, collaborators, labels }, ownProps) => {
    const activeIssue = issues.issueList.find(issue => issue.id === ownProps.issue.id);
    return ({
        activeIssue,
        collaborators,
        labels,
    });
};

const mapDispatch = { editIssue };

export default connect(mapState, mapDispatch)(EditIssue);
