import React from "react";
import PropTypes from "prop-types";
import PollForm from "./PollForm";

class VotePoll extends React.Component {
    constructor(props) {
        super(props);
        let itemIndex = props.votesCount.findIndex((vote) => vote.selectedByUser);
        let voteId;
        if (itemIndex >= 0) {
            voteId = props.votesCount[itemIndex].pollItem.id
        }
        this.state = {voteId: voteId};
    }

    handleChange(e) {
        //e.preventDefault();
        this.setState({voteId: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onVote(this.props.poll.id, this.state.voteId);
    }

    handleClose(e) {
        e.preventDefault();
        this.props.onCancel();
    }

    render() {
        let {poll, votesCount} = this.props;
        let voteId = this.state.voteId;
        let totalVotes = votesCount.reduce((acc, vote) => acc + vote.total, 0);
        if (totalVotes === 0) {
            totalVotes = 1;
        }
        let options = votesCount.map(vote => {
            let item = vote.pollItem;
            let percent = Math.round(vote.total / totalVotes * 100).toString() + "%"
            return (
                <div>
                    <input className="m-1" type="radio"
                           name="option"
                           value={item.id}
                           checked={voteId === item.id}
                           onChange={this.handleChange.bind(this)}/>
                    {item.title}
                    <div className="progress" key={item.id}>
                        <div className="progress-bar" role="progressbar" style={{width: percent}}>
                            {vote.total}
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <h4>Select option you want to vote for &quot;{poll.title}&quot; poll:</h4>
                <div className="m-1">{options}</div>
                <button className="btn btn-primary m-1" type="submit">Save and close</button>
                <button className="btn btn-primary m-1" onClick={this.handleClose.bind(this)}>Cancel</button>
            </form>
        );
    }
}

PollForm.propTypes = {
    poll: PropTypes.shape({
        title: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired
            }).isRequired).isRequired
    }).isRequired,
    votesCount: PropTypes.arrayOf(
        PropTypes.shape({
            pollItem: PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired
            }).isRequired,
            total: PropTypes.number.isRequired,
            selectedByUser: PropTypes.bool.isRequired
        })).isRequired,
    onVote: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default VotePoll;