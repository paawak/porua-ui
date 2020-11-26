import React from 'react';
import OcrCorrectionPage from './OcrCorrectionPage'
import ImageUploader from './ImageUploader'
import PageSelectionPanel from './PageSelectionPanel'
import GoogleSignInComponent from './GoogleSignInComponent';

export const DisplayMode = {
      PAGE_SELECTION: 'PAGE_SELECTION',
      IMAGE_UPLOADER: 'IMAGE_UPLOADER',
      OCR_CORRECTION_PAGE: 'OCR_CORRECTION_PAGE'
    };

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      googleAccessToken: null,
      displayMode: DisplayMode.PAGE_SELECTION,
      ocrWords: [],
      book: null,
      page: null
    };

    this.loginSuccess = this.loginSuccess.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
  }

  render() {
    if (this.state.isLoggedIn) {
      return this.renderApplicationAfterLogin();
    } else {
      return this.renderLoginPage();
    }    
  }

  renderLoginPage() {
    return (
      <GoogleSignInComponent loginSuccess={this.loginSuccess} handleLoginFailure={this.handleLoginFailure}/>
    );
  }

  loginSuccess(response) {
    if(response.accessToken){
      this.setState(state => ({
        isLoggedIn: true,
        googleAccessToken: response.tokenId
      }));
    }
  }

  handleLoginFailure (response) {
    alert('Failed to log in')
  }

  renderNavBar() {
    
    return (
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">            
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMainMenu" aria-controls="navbarMainMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>      
      <div className="collapse navbar-collapse" id="navbarMainMenu">        
        <ul className="navbar-nav">    
          <li className="nav-item dropdown active">
              <div className="nav-link dropdown-toggle" id="navbarMainMenuChooseBook" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <a class="navbar-brand" href="#">
                  <img src="/bars-solid.svg" width="30" height="30" alt="" loading="lazy"/>
                </a>    
                <span className="sr-only">(current)</span>
              </div>        
              <div className="dropdown-menu" aria-labelledby="navbarMainMenuChooseBook">
                <div className="dropdown-item">Choose Book</div>
              </div>            
            </li>     
            {this.state.page &&
            <>                    
            <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle" id="navbarLanguageMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Language
              </div>            
              <div className="dropdown-menu" aria-labelledby="navbarLanguageMenuLink">
                <div className="dropdown-item disabled" tabindex="-1" aria-disabled="true">{this.state.page.book.language}</div>
              </div>            
            </li>
            <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle" id="navbarBookMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Book
              </div>              
              <div className="dropdown-menu" aria-labelledby="navbarBookMenuLink">
                <div className="dropdown-item disabled" tabindex="-1" aria-disabled="true">{this.state.page.book.name}</div>
              </div>            
            </li>
            <li className="nav-item dropdown">
              <div className="nav-link dropdown-toggle" id="navbarPageMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Page
              </div>            
              <div className="dropdown-menu" aria-labelledby="navbarPageMenuLink">
                <div className="dropdown-item disabled" tabindex="-1" aria-disabled="true">{this.state.page.name}</div>
              </div>            
            </li>
            </>
            }
        </ul>      
      </div>                    
    </nav>
    );
  }

  renderApplicationAfterLogin() {
    let panelToDisplay;
    const ocrWordsRecievedEvent = (ocrWordListData, page) => {
        this.setState({
          ocrWords: ocrWordListData,
          displayMode: DisplayMode.OCR_CORRECTION_PAGE,
          page: page
        });
    };
    if (this.state.displayMode === DisplayMode.PAGE_SELECTION) {
      panelToDisplay = <PageSelectionPanel
        ocrWordsRecievedForExistingPage={ocrWordsRecievedEvent}
        showNewPagePanel={(book) => {
            this.setState({
              displayMode: DisplayMode.IMAGE_UPLOADER,
              book: book
            });
          }
        }
        googleAccessToken={this.state.googleAccessToken}
      />;
    } else if (this.state.displayMode === DisplayMode.IMAGE_UPLOADER) {
      panelToDisplay = <div className="shadow mb-5 bg-white rounded p-2 bd-highlight">
        <ImageUploader 
          book={this.state.book} ocrWordsRecievedForNewPage={ocrWordsRecievedEvent}
          googleAccessToken={this.state.googleAccessToken}
        />
      </div>;
    } else if (this.state.displayMode === DisplayMode.OCR_CORRECTION_PAGE) {
      panelToDisplay = 
      <div className="shadow mb-5 bg-white rounded p-2 bd-highlight">
        <OcrCorrectionPage 
          ocrWords={this.state.ocrWords} 
          page={this.state.page}
          googleAccessToken={this.state.googleAccessToken}
        />
      </div>
    } else {
      panelToDisplay = <div/>;
    }

    return (
      <div className="jumbotron jumbotron-fluid">
        <div className="container-xl">
          <h1 className="display-4">OCR Training Workbench</h1>
          {this.renderNavBar()}
          {panelToDisplay}
          </div>          
      </div>
    );
  }

}

export default App;
