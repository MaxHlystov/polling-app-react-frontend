import React from "react";
import PropTypes from "prop-types";
import PollForm from "./PollForm";

class VotePoll extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (e) => {
            //e.preventDefault();
            this.props.onChangeOption(e.target.value);
        }

        this.handleSubmit = (e) => {
            e.preventDefault();
            this.props.onVote(this.props.poll.id, this.props.voteId);
        }

        this.handleClose = (e) => {
            e.preventDefault();
            this.props.onCancel();
        }
    }

    render() {
        let {poll, votesCount, voteId} = this.props;
        let totalVotes = votesCount.reduce((acc, vote) => acc + vote.total, 0);
        if (totalVotes === 0) {
            totalVotes = 1;
        }
        let options = votesCount.map(vote => {
            let item = vote.pollItem;
            let percent = Math.round(vote.total / totalVotes * 100).toString() + "%";
            return (
                <div key={item.id}>
                    <input className="m-1" type="radio"
                           name={item.id}
                           value={item.id}
                           checked={voteId === item.id}
                           onChange={this.handleChange}/>
                    {item.title}
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{width: percent}}>
                            {vote.total}
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <form onSubmit={this.handleSubmit}>
                <h4>Select option you want to vote for &quot;{poll.title}&quot; poll:</h4>
                <div className="m-1">{options}</div>
                <button className="btn btn-primary m-1" type="submit">Save and close</button>
                <button className="btn btn-primary m-1" onClick={this.handleClose}>Cancel</button>
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
    voteId: PropTypes.string.isRequired,
    votesCount: PropTypes.arrayOf(
        PropTypes.shape({
            pollItem: PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired
            }).isRequired,
            total: PropTypes.number.isRequired,
            selectedByUser: PropTypes.bool.isRequired
        })).isRequired,
    onChangeOption: PropTypes.func.isRequired,
    onVote: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default VotePoll;