import React, { Component } from 'react'
import AlertType from './AlertType'

interface AlertProps {
  message?: string;
  alertType?: AlertType;
}

interface AlertState {
}

class Alert extends Component<AlertProps, AlertState> {

  constructor(props: AlertProps) {
    super(props);
  }

  render() {
    let className = "alert alert-dismissible fade show";
    let message;

    if (this.props.alertType === AlertType.SUCCESS) {
      className += " alert-success";
      message = "<strong>Success!</strong> " + this.props.message + " operation was succesful!";
    } else if (this.props.alertType === AlertType.ERROR) {
      className += " alert-danger";
      message = "<strong>Error in " + this.props.message + " operation!</strong> Please try again."
    }

    return (
      <div className={className} role="alert">
        {message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default Alert;
