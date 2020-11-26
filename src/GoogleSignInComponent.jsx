import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';


const CLIENT_ID = '955630342713-55eu6b3k5hmsg8grojjmk8mj1gi47g37.apps.googleusercontent.com';


class GoogleSignInComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="text-center mb-4">
        <h1 className="h3 mb-3 font-weight-normal">Welcome to Porua: A Bengali OCR Correction Platform</h1>
        <p>Sign In</p>
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText='Google'
          onSuccess={this.props.loginSuccess}
          onFailure={this.props.handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          responseType='code,token'
        />
      </div>
    )
  }
}

export default GoogleSignInComponent;
