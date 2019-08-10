import React from "react";
import PropTypes from 'prop-types';

class AuthUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: getUserName(props.user)
            , error: undefined
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            userName: event.target.value
            , error: undefined
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:8080/auth?userName=' + this.state.userName, {
            method: "POST",
            headers: {
                'Accept': 'application/json'
            },
        }).then((response) => {
            response.json().then(
                (user) => {
                    this.props.onUserAuth(user);
                },
                (error) => {
                    this.setState({
                        error: error.message
                    });
                }
            )
        }).catch(error => {
            this.setState({
                error: error.message
            });
        });
    }

    render() {
        let errorComponent;
        if (this.state.error !== undefined) {
            errorComponent = (
                <div>
                    <h4>Error retrieving authentication.</h4>
                    {this.state.error}
                </div>
            );
        }
        return (
            <div className="auth-user">
                <h3>Please enter user name to authorize</h3>
                <form onSubmit={this.handleSubmit}>
                    <label className="m-2">
                        User name
                        <input type="text"
                               className="m-2"
                               value={this.state.userName}
                               onChange={this.handleChange}/>
                    </label>
                    <input className="m-2" type="submit" value="Authorize"/>
                </form>
                {errorComponent}
            </div>
        );
    }
}

function getUserName(user) {
    if (user !== undefined) {
        return user.name;
    }
    return undefined
}

AuthUser.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.array.isRequired
    }),
    onUserAuth: PropTypes.func.isRequired,
};

export default AuthUser;