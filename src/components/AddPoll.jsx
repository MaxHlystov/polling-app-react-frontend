import React from "react";
import PollForm from "./PollForm";
import PropTypes from "prop-types";

class AddPoll extends React.Component {
    componentWillMount() {
        this.setState({
            id: undefined,
            title: '',
            editable: true,
            items: []
        });
    }

    handleChange(field, value) {
        this.setState({[field]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    handleClose(e) {
        this.props.onCancel();
    }

    render() {
        return (
            <div>
                <h4>Add a poll.</h4>
                <PollForm buttonLabel="Add a poll"
                          poll={this.state}
                          handleChange={this.handleChange.bind(this)}
                          handleSubmit={this.handleSubmit.bind(this)}
                          handleClose={this.handleClose.bind(this)}/>
            </div>
        );
    }
}

AddPoll.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddPoll;