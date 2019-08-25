import React from "react";
import LoginComponent from "./LoginComponent";
import PollsListContainer from "./PollsListContainer";

class PollingApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
        };
    }

    handleUserAuth(user) {
        this.setState({user: user});
    }

    render() {
        let childComponent;
        if (this.state.user === undefined) {
            childComponent = <LoginComponent user={this.state.user} onUserAuth={this.handleUserAuth.bind(this)}/>;
        } else {
            childComponent = <PollsListContainer user={this.state.user}/>;
        }
        return (
            <div className="container">
                <div className="row">
                    <h1>Voting app</h1>
                </div>
                <div className="row">
                    {childComponent}
                </div>
            </div>
        );
    }
}


export default PollingApp;