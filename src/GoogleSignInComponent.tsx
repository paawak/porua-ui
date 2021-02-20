import React, { Component } from 'react'
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Alert from './Alert';
import AlertType from './AlertType';


const CLIENT_ID = '955630342713-55eu6b3k5hmsg8grojjmk8mj1gi47g37.apps.googleusercontent.com';

interface GoogleSignInComponentProps {
  loginSuccess?: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  handleLoginFailure?: Function;
}

interface GoogleSignInComponentState {
  loginFailed: boolean;
}

class GoogleSignInComponent extends Component<GoogleSignInComponentProps, GoogleSignInComponentState> {

  state: GoogleSignInComponentState = {
    loginFailed: false
  };

  constructor(props:GoogleSignInComponentProps) {
    super(props);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
  }

  handleLoginFailure (response:any) {
    this.setState({
      loginFailed: true
    });
  }

  render() {
    return (
      <div className="text-center mb-4">        
        <h1 className="h3 mb-3 font-weight-normal">Welcome to Porua: A Bengali OCR Correction Platform</h1>
        {this.state.loginFailed &&
        <Alert message="Sign In" alertType={AlertType.ERROR}/>
        }
        <p>Sign In</p>
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText='Google'
          onSuccess={this.props.loginSuccess}
          onFailure={this.handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          responseType='code,token'
        />
      </div>
    )
  }
}

export default GoogleSignInComponent;
