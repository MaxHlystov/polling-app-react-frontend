import React from "react";
import PropTypes from 'prop-types';

const API_URL = process.env.REACT_APP_API_URL;

const API_HEADERS = {
    'Content-Type': 'application/json',
};

class AuthUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: getUserName(props.user)
            , error: undefined
        };
        this.handleChange = (event) => {
            this.setState({
                userName: event.target.value
                , error: undefined
            });
        };
        this.handleSubmit = (event) => {
            event.preventDefault();
            fetch(`${API_URL}/auth?userName=${this.state.userName}`, {
                method: "POST",
                headers: API_HEADERS,
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
        };
    }

    render() {
        let {error, userName} = this.state;
        let errorComponent;
        if (error !== undefined) {
            errorComponent = (
                <div>
                    <h4>Error retrieving authentication.</h4>
                    {error}
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
                               value={userName}
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