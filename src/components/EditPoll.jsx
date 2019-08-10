import React from "react";
import PollForm from "./PollForm";
import PropTypes from "prop-types";

class EditPoll extends React.Component {
    componentWillMount() {
        this.setState({...this.props.poll});
    }

    handleChange(field, value) {
        this.setState({[field]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    handleClose() {
        this.props.onCancel();
    }

    render() {
        return (
            <div>
                <h4>Add a poll.</h4>
                <PollForm buttonLabel="Edit a poll"
                          poll={this.state}
                          handleChange={this.handleChange.bind(this)}
                          handleSubmit={this.handleSubmit.bind(this)}
                          handleClose={this.handleClose.bind(this)}/>
            </div>
        );
    }
}

EditPoll.propTypes = {
    poll: PropTypes.shape({
        title: PropTypes.string.isRequired,
        editable: PropTypes.bool.isRequired,
        items: PropTypes.array.isRequired
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default EditPoll;