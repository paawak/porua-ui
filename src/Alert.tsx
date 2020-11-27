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

    if (this.props.alertType === AlertType.SUCCESS) {
      className += " alert-success";
    } else if (this.props.alertType === AlertType.ERROR) {
      className += " alert-danger";
    }

    return (
      <div className={className} role="alert">

        {(() => {
          if (this.props.alertType === AlertType.SUCCESS) {
            return <><strong>Success!</strong>{this.props.message} operation was succesful!</>
          } else if (this.props.alertType === AlertType.ERROR) {
            return <><strong>Error in {this.props.message} operation!</strong> Please try again.</>
          } else {
            return <strong>{this.props.message}</strong>
          }
        })()
        }

        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default Alert;
