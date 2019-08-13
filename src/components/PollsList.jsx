import React from "react";
import PropTypes from 'prop-types';

class PollsList extends React.Component {

    handleAddPoll() {
        this.props.addPoll();
    }

    handleEditPoll(pollId) {
        this.props.editPoll(pollId);
    }

    handleVotePoll(pollId) {
        this.props.votePoll(pollId);
    }

    handleDeletePoll(pollId) {
        this.props.deletePoll(pollId);
    }

    render() {
        const {user, polls} = this.props;
        let listStuff;
        if (polls.length > 0) {
            listStuff = (
                <table className="polls">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {polls.map(poll => {
                        let userButtons = "";
                        if (poll.editable) {
                            userButtons = (
                                <div>
                                    <button className="btn btn-primary m-1"
                                            onClick={this.handleEditPoll.bind(this, poll.id)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-primary m-1"
                                            onClick={this.handleDeletePoll.bind(this, poll.id)}>
                                        Delete
                                    </button>
                                </div>
                            );
                        }
                        return (
                            <tr key={poll.id}>
                                <td className="m-1">
                                    <a onClick={this.handleVotePoll.bind(this, poll.id)} href="#">
                                        {poll.title}
                                    </a>
                                </td>
                                <td className="m-1">
                                    {userButtons}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            );
        } else {
            listStuff = <p>There are no any polls to show. Add new one.</p>;
        }

        return (
            <div className="polls-list">
                <h3>Polls created by {user.name}.</h3>
                {listStuff}
                <button className="btn btn-primary"
                        onClick={this.handleAddPoll.bind(this)}>
                    Add new poll
                </button>
            </div>);
    }
}

PollsList.propTypes = {
    polls: PropTypes.array.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    addPoll: PropTypes.func.isRequired,
    editPoll: PropTypes.func.isRequired,
    votePoll: PropTypes.func.isRequired,
    deletePoll: PropTypes.func.isRequired
};

export default PollsList;