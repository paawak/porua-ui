import React from 'react';
import ImageProcessingInProgress from './ImageProcessingInProgress';

export const DisplayMode = {
  IMAGE_UPLOADER: 'IMAGE_UPLOADER',
  IMAGE_PROCESSING_IN_PROGRESS: 'IMAGE_PROCESSING_IN_PROGRESS'
};

class ImageUploader extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.imageFileInput = React.createRef();
    this.state = {
      isImageFileSelected: false,
      selectedImageFileName: 'Choose file...',
      pageNumber: -1,
      displayMode: DisplayMode.IMAGE_UPLOADER,
      errorOccuredDuringImageUpload: false,
      errorMessage: null
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.isImageFileSelected) {
      const data = new FormData();
      data.append('bookId', this.props.book.id);
      data.append('pageNumber', this.state.pageNumber);
      data.append('image', this.imageFileInput.current.files[0]);      

      fetch(`${process.env.REACT_APP_REST_API_BASE_NAME}/ocr/train/submit/image`, {
        method: 'POST',
        body: data,
        headers:{
          'Authorization': this.props.googleAccessToken
        }
      }).then(response => {
        if (response.status !== 200) {
          this.setState({
            errorOccuredDuringImageUpload: true,
            displayMode: DisplayMode.IMAGE_UPLOADER
          });
        }           
        return response.json();
      }).then(jsonReponse => {
        if (this.state.errorOccuredDuringImageUpload) {
          this.setState({
            errorMessage: jsonReponse.message
          });
        } else {
          let page = {name: this.state.selectedImageFileName, book: this.props.book};
          this.props.ocrWordsRecievedForNewPage(jsonReponse, page);          
        }
      });

      this.setState({
        displayMode: DisplayMode.IMAGE_PROCESSING_IN_PROGRESS,
        errorOccuredDuringImageUpload: false,
        errorMessage: null
      });

    } else {
      alert("Please select an image to upload");
    }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_REST_API_BASE_NAME}/ocr/train/query/book/${this.props.book.id}/page-count`, 
      {
        headers:{
          'Authorization': this.props.googleAccessToken
        }
      })
      .then(response => response.text()).then(textResponse => {
        this.setState({
          pageNumber: parseInt(textResponse, 10) + 1
        });
      });
  }

  render() {
    let panelToDisplay;

    if (this.state.displayMode === DisplayMode.IMAGE_UPLOADER) {
      panelToDisplay = this.renderImageUploadForm();
    } else if (this.state.displayMode === DisplayMode.IMAGE_PROCESSING_IN_PROGRESS) {
      panelToDisplay = <ImageProcessingInProgress/>;      
    } else {
      panelToDisplay = <div/>;
    }
    return panelToDisplay;
  }


  renderImageUploadForm() {
    return <form onSubmit={this.handleSubmit}>
      { this.state.errorOccuredDuringImageUpload && this.renderErrorMessage() }
      <p className="lead">Upload a new image to OCR</p>
      <fieldset className="form-group" disabled>
        <label htmlFor="bookName">Selected Book</label>
        <input type="text" id="bookName" className="form-control" placeholder={this.props.book.name} />
      </fieldset>
      <fieldset className="form-group" disabled>
        <label htmlFor="languageName">Selected Language</label>
        <input type="text" id="languageName" className="form-control" placeholder={this.props.book.language} />
      </fieldset>
      <div className="form-group">
        <label htmlFor="pageNumber">Page Number</label>
        <input type="number" className="form-control" id="pageNumber" readOnly={true} value={this.state.pageNumber} />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="imageAddon">Upload Image</span>
        </div>
        <div className="custom-file">
          <input type="file" ref={this.imageFileInput} className="custom-file-input" name="image" id="image" aria-describedby="imageAddon" onChange={e => {
            this.setState({
              isImageFileSelected: true,
              selectedImageFileName: this.imageFileInput.current.files[0].name
            });
          } } />
          <label className="custom-file-label" htmlFor="image">{this.state.selectedImageFileName}</label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Send To OCR</button>
    </form>;
  }

  renderErrorMessage() {
    return <div className="alert alert-danger alert-dismissible fade show" role="alert">
    <h4 className="alert-heading">Error uploading image!</h4>
    <p>
      Could not upload image for analysis.
    </p>
    <hr/>
    <p className="mb-0">{this.state.errorMessage}</p>
    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>;
  }

}

export default ImageUploader;
