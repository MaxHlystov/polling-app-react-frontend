import React from "react";
import PropTypes from 'prop-types';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;
const API_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
};

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: getUserName(props.user),
            password: "",
            error: undefined,
        };
        this.handleChange = (event) => {
            this.setState({
                [event.target.name]: event.target.value
                , error: undefined
            });
        };
        this.handleSubmit = (event) => {
            event.preventDefault();
            fetch(`${API_URL}/login`,
                {
                    method: "POST",
                    headers: API_HEADERS,
                    body: `username=${this.state.userName}&password=${this.state.password}`,
                })
            .then((response) => {
                if(response.status == 200) {
                    response.json().then((user) => {
                        if (user.error === undefined) {
                            this.props.onUserAuth(user);
                        } else {
                            this.setState({
                                error: user.message
                            });
                        }
                    }).catch((error) => { this.setState({ error: error.message }); })
                }
                else { this.setState({ error: response.statusText }); }
            })
            .catch((error) => { this.setState({ error: error.message }); });
        };
    }

    render() {
        let {error, userName, email, password} = this.state;
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
                <h3>Please, enter user name and password to login.</h3>
                <form onSubmit={this.handleSubmit}>
                    <label className="m-2">
                        User name
                        <input type="text"
                               className="m-2"
                               name="userName"
                               value={userName}
                               onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <label className="m-2">
                        Password
                        <input type="password"
                               className="m-2"
                               name="password"
                               value={password}
                               onChange={this.handleChange}/>
                    </label>
                    <input className="m-2" type="submit" value="Login"/>
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

function getEmail(user) {
    if (user !== undefined) {
        let email = user.email;
        if (email !== undefined) {
            return email;
        }
    }
    return undefined
}

LoginComponent.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.array.isRequired,
        password: PropTypes.string.isRequired,
    }),
    onUserAuth: PropTypes.func.isRequired,
};

export default LoginComponent;