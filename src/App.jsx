import React from 'react';
import OcrCorrectionPage from './OcrCorrectionPage'
import ImageUploader from './ImageUploader'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayImageUploader: true,
      imageProcessingInProgress: true,
      ocrWords: []
    };
  }

  render() {
    let panelToDisplay;

    if (this.state.displayImageUploader) {
      panelToDisplay = <div className="shadow mb-5 bg-white rounded p-2 bd-highlight"><ImageUploader
      imageSubmittedForAnalysis={() => {
          this.setState({
            displayImageUploader: false
          });
        }
      }
      ocrWordsRecieved={ocrWordListData => {
          this.setState({
            ocrWords: ocrWordListData,
            imageProcessingInProgress: false
          });
        }
      }/></div>;
    } else if (this.state.imageProcessingInProgress) {
      panelToDisplay = <p className="lead">Image is being analysed...</p>
    } else {
      panelToDisplay = <div className="shadow mb-5 bg-white rounded p-2 bd-highlight"><OcrCorrectionPage ocrWords={this.state.ocrWords}/></div>
    }

    return (
      <div className="jumbotron jumbotron-fluid">
        <div className="container-xl">
          <h1 className="display-4">OCR Training Workbench</h1>
          {panelToDisplay}
          </div>
      </div>
    );
  }
}

export default App;
