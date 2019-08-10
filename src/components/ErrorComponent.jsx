import React from "react";
import PropTypes from "prop-types";

class ErrorComponent extends React.Component {
    render() {
        return (
            <div className="alert alert-danger" role="alert">
                <h4>{this.props.message}</h4>
            </div>
        );
    }
}

ErrorComponent.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ErrorComponent;