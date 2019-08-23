import React from "react";
import PropTypes from 'prop-types';

const bcrypt = require('bcryptjs');

const API_URL = process.env.REACT_APP_API_URL;

const API_HEADERS = {
    'Content-Type': 'application/json',
};

class AuthUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: getUserName(props.user),
            email: getEmail(props.user),
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
            bcrypt.genSalt(10)
                .then((err, salt) => {
                    if (err === undefined) {
                        return bcrypt.hash(this.state.user.password, salt);
                    }
                })
                .then((err, hash) => {
                    if (err === undefined) {
                        const email = this.state.email === "" ? "" : `&email=${this.state.email}`;
                        return fetch(`${API_URL}/auth?userName=${this.state.userName}&password=${hash}${email}`,
                            {
                                method: "POST",
                                headers: API_HEADERS,
                            })
                    }
                })
                .then((response) => {
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
                <h3>Please enter user name to authorize</h3>
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
                        E-mail
                        <input type="text"
                               className="m-2"
                               name="email"
                               value={email}
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

function getEmail(user) {
    if (user !== undefined) {
        let email = user.email;
        if (email !== undefined) {
            return email;
        }
    }
    return undefined
}

AuthUser.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.array.isRequired,
        email: PropTypes.string,
        password: PropTypes.string.isRequired,
    }),
    onUserAuth: PropTypes.func.isRequired,
};

export default AuthUser;