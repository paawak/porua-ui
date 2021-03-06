import React from 'react';
import BanglaTextBox from './BanglaTextBox'

class OcrWord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markForDelete: false,
      correctedText: this.props.correctedText
    };
    this.handleCloseButton = this.handleCloseButton.bind(this);
  }

  handleCloseButton(event) {
    this.setState({
      markForDelete: !this.state.markForDelete
    });
    this.props.toggleMarkedForDeletion();
  }

  render() {

    const idGenerator = (prefix) => prefix + "_" + this.props.wordSequenceId;
    const correctedTextInputId = idGenerator("correctedText");
    const closeButtonId = idGenerator("closeButton");

    const bgColorGenerator = () => {
      const ff = 0xff;
      let green = parseInt(this.props.confidence) * ff / 100;    
      let red = ff - green;
      return "rgb(" + red + ", " + green + ", 0)";
    };        

    let highlightColor = "";

    if (this.state.markForDelete) {
      highlightColor = "bg-danger";
    } else if (this.state.correctedText) {
      highlightColor = "bg-warning";
    }
    
    return (
      <div className="col">                  
          <div className="container p-2">                                               
              <div className={`row row-cols-1 overflow-auto border border-warning  ${highlightColor}`}>              
                <div className="col">
                  <button type="button" id={closeButtonId} className="close text-danger btn-outline-warning" aria-label="Close" 
                    onClick={this.handleCloseButton}>
                    <span aria-hidden="true">&times;</span>
                  </button> 
                </div>                       
                <div className="col pb-3">
                  <img id={idGenerator("ocrImage")} alt="..." 
                  src={`${process.env.REACT_APP_REST_API_BASE_NAME}/ocr/train/query/word/image?bookId=${this.props.bookId}&pageImageId=${this.props.pageImageId}&wordSequenceId=${this.props.wordSequenceId}&Authorization=${this.props.googleAccessToken}`}/>
                </div>
                <div className="col alert alert-dark jumbotron jumbotron-fluid" role="alert">
                  <p className="lead">OCR Text</p>
                  <hr className="my-4"/>
                  <h1 className="display-4">{this.props.givenText}</h1>
                  <hr className="my-4"/>                  
                  <h6>
                    * <small style={{backgroundColor: bgColorGenerator()}}>Confidence: {parseInt(this.props.confidence)}%</small>
                  </h6>
                </div>
                <div className="col p-3 form-group">
                  <BanglaTextBox name={correctedTextInputId} id={correctedTextInputId} 
                    placeholder={this.state.correctedText == null ? "Correct Text" : this.state.correctedText}
                    disabled={this.state.markForDelete}
                    onBlur={evt => {     
                      const textValue = evt.target.value;  
                      this.props.markForCorrection(textValue);                                     
                      this.setState({
                        correctedText: textValue
                      });
                    } 
                    }/>
                </div>
              </div>            
          </div>        
      </div>
    );
  }

}

export default OcrWord;
