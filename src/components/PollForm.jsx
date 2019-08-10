import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PollItems from "./PollItems";

class PollForm extends Component {

    handleChange(field, e) {
        this.props.handleChange(field, e.target.value);
    }

    handleOptionsChange(options) {
        this.props.handleChange("items", options);
    }

    handleClose(e) {
        e.preventDefault();
        this.props.handleClose();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit.bind(this)}>
                    <label htmlFor="title">Poll title</label>
                    <input className="m-1" type="text"
                           id="title"
                           name="title"
                           value={this.props.poll.title}
                           onChange={this.handleChange.bind(this, 'title')}
                           required={true}
                           autoFocus={true}/>
                    <h4>Options to vote:</h4>
                    <PollItems items={this.props.poll.items}
                               handleChange={this.handleOptionsChange.bind(this)}/>
                    <button className="btn btn-primary m-1" type="submit">
                        {this.props.buttonLabel}
                    </button>
                    <button className="btn btn-primary m-1" onClick={this.handleClose.bind(this)}>
                        Cancel
                    </button>
                </form>
            </div>
        );
    }
}

PollForm.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    poll: PropTypes.shape({
        title: PropTypes.string.isRequired,
        editable: PropTypes.bool.isRequired,
        items: PropTypes.array.isRequired
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default PollForm;