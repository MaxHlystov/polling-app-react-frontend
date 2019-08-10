import React from "react";
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import PollsList from "./PollsList";
import PollForm from "./PollForm";
import AddPoll from "./AddPoll";
import EditPoll from "./EditPoll";
import VotePoll from "./VotePoll";
import ErrorComponent from "./ErrorComponent";

const API_URL = 'http://localhost:8080';
const API_HEADERS = {
    'Content-Type': 'application/json',
};

class PollsListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            routeState: RouteStates.PollList
        };
    }

    componentDidMount() {
        fetch(`${API_URL}/polls?userId=${this.props.user.id}`,
            {
                method: "GET",
                headers: API_HEADERS
            })
            .then(res => res.json().then(
                (polls) => {
                    this.setState({
                        isLoaded: true,
                        polls: polls
                    });

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error.message
                    });
                }));

    }

    handleEditorCancel() {
        this.setState({routeState: RouteStates.PollList});
    }

    startAddPoll() {
        this.setState({routeState: RouteStates.AddPoll});
    }

    startEditPoll(pollId) {
        let poll = this.getPoll(pollId);
        if (poll !== undefined) {
            this.setState({routeState: RouteStates.EditPoll, poll: poll});
        }
    }

    startVotePoll(pollId) {
        let poll = this.getPoll(pollId);
        if (poll !== undefined) {
            fetch(`${API_URL}//votes?userId=${this.props.user.id}&pollId=${pollId}`,
                {method: "GET",})
                .then((response) => {
                        if (!response.ok) {
                            throw new Error("Server response wasn't OK");
                        } else {
                            return response.json();
                        }
                    }
                )
                .then((votesCount) => {
                    this.setState({
                        routeState: RouteStates.Vote,
                        poll: poll,
                        votesCount: votesCount,
                    });
                })
                .catch((error) => {
                    this.setState({error: error.message});
                });
        }
    }

    addPoll(poll) {
        if (poll.id === null) {
            poll = Object.assign({}, poll, {id: Date.now().toString()});
        }
        let newPolls = update(this.state.polls, {$push: [poll]});
        let newState = {error: undefined, polls: newPolls, routeState: RouteStates.PollList};
        this.sendPoll(poll, "POST", newState);
    }

    editPoll(poll) {
        let pollIndex = this.state.polls.findIndex((poll_) => poll_.id === poll.id);
        let newPolls = update(this.state.polls, {[pollIndex]: {$set: poll}});
        let newState = {error: undefined, polls: newPolls, routeState: RouteStates.PollList};
        this.sendPoll(poll, "PUT", newState);
    }

    sendPoll(poll, method, newState) {
        let prevState = this.state;
        fetch(`${API_URL}/polls`, {
            method: method,
            body: JSON.stringify({userId: this.props.user.id, poll: poll}),
            headers: API_HEADERS
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("Server response wasn't OK")
                }
            })
            .then((responseData) => {
                poll.id = responseData.id;
                this.setState(newState);
            })
            .catch((error) => {
                this.setState({...prevState, error: error.message, routeState: RouteStates.PollList});
            });
    }

    votePoll(pollId, itemId) {
        fetch(`${API_URL}/votes?userId=${this.props.user.id}&pollId=${pollId}&option=${itemId}`,
            {method: "POST"})
            .then((response) => {
                    if (!response.ok) {
                        throw new Error("Server response wasn't OK");
                    } else {
                        this.setState({routeState: RouteStates.PollList});
                    }
                }
            )
            .catch((error) => {
                this.setState({error: error.message});
            });
    }

    deletePoll(pollId) {
        let prevState = this.state;
        let pollIndex = this.state.polls.findIndex((poll) => poll.id === pollId);
        let newPolls = update(this.state, {
            polls: {$splice: [[pollIndex, 1]]}
        });
        fetch(`${API_URL}/polls?userId=${this.props.user.id}&&pollId=${pollId}`, {method: "DELETE"})
            .then((response) => {
                    if (!response.ok) {
                        throw new Error("Server response wasn't OK");
                    } else {
                        this.setState({polls: newPolls, routeState: RouteStates.PollList});
                    }
                }
            )
            .catch((error) => {
                this.setState({...prevState, error: error.message});
            });
    }

    render() {
        const {error, isLoaded} = this.state;
        let errorComponent;
        if (error) {
            errorComponent = <ErrorComponent message={"Ошибка: " + error}/>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        }
        let childComponent = this.manualRoute(this.state.routeState);
        return <div>
            {errorComponent}
            {childComponent}
        </div>;
    }

    manualRoute(routeState) {
        switch (routeState) {
            case RouteStates.PollList:
                return <PollsList user={this.props.user}
                                  polls={this.state.polls}
                                  addPoll={this.startAddPoll.bind(this)}
                                  editPoll={this.startEditPoll.bind(this)}
                                  votePoll={this.startVotePoll.bind(this)}
                                  deletePoll={this.deletePoll.bind(this)}/>;
                break;
            case RouteStates.AddPoll:
                return <AddPoll user={this.state.user}
                                onSubmit={this.addPoll.bind(this)}
                                onCancel={this.handleEditorCancel.bind(this)}/>;
                break;
            case RouteStates.EditPoll:
                return <EditPoll user={this.state.user}
                                 poll={this.state.poll}
                                 onSubmit={this.editPoll.bind(this)}
                                 onCancel={this.handleEditorCancel.bind(this)}/>;
                break;
            case RouteStates.Vote:
                return <VotePoll user={this.state.user}
                                 poll={this.state.poll}
                                 votesCount={this.state.votesCount}
                                 onVote={this.votePoll.bind(this)}
                                 onCancel={this.handleEditorCancel.bind(this)}/>;
                break;
            default:
                break;
        }
        // By default use PollList
        return <PollsListContainer user={this.state.user}/>;
    }

    getPoll(pollId) {
        let pollIndex = this.state.polls.findIndex((poll) => poll.id === pollId);
        if (pollIndex >= 0) {
            return this.state.polls[pollIndex];
        }
        return undefined;
    }
}

PollForm.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
};

const RouteStates = {
    "PollList": 1,
    "AddPoll": 2,
    "EditPoll": 3,
    "Vote": 4
};

export default PollsListContainer;