import React from 'react';
import ImageProcessingInProgress from './ImageProcessingInProgress';

export const NEW_PAGE_OPTION = "NEW_PAGE_OPTION";

export const DisplayMode = {
  PAGE_SELECTION_FORM: 'PAGE_SELECTION_FORM',
  IMAGE_PROCESSING_IN_PROGRESS: 'IMAGE_PROCESSING_IN_PROGRESS'
};

class PageSelectionPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      pages: [],
      selectedBookId: null,
      selectedPageId: null,
      displayMode: DisplayMode.PAGE_SELECTION_FORM
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    if ((this.state.selectedBookId == null) || (this.state.selectedBookId === '')) {
      alert('Select a Book');
      return;
    }

    if ((this.state.selectedPageId == null) || (this.state.selectedPageId === '')) {
      alert('Select a Page');
      return;
    }

    if (this.state.selectedPageId === NEW_PAGE_OPTION) {
      let bookId = this.state.selectedBookId;
      let book = this.state.books.filter(book => book.id === parseInt(bookId, 10))[0];
      this.props.showNewPagePanel(book);
    } else {
      this.setState({
        displayMode: DisplayMode.IMAGE_PROCESSING_IN_PROGRESS
      });
      let pageId = this.state.selectedPageId;
      let page = this.state.pages.filter(page => page.id === parseInt(pageId, 10))[0];
      fetch(`${process.env.REACT_APP_REST_API_BASE_NAME}/ocr/train/query/word?bookId=${this.state.selectedBookId}&pageImageId=${pageId}`,
        {
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.props.googleAccessToken
          }
        })
        .then(rawData => rawData.json())
        .then(data => this.props.ocrWordsRecievedForExistingPage(data, page))
        .catch(() => this.setState({ hasErrors: true }));
    }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_REST_API_BASE_NAME}/ocr/train/query/book`, {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.googleAccessToken
      }
    }
    )
      .then(rawData => rawData.json())
      .then(books => this.setState({ books: books }))
      .catch(() => this.setState({ hasErrors: true }));
  }

  render() {    
    let panel;
    if (this.state.displayMode === DisplayMode.PAGE_SELECTION_FORM) {
      panel = this.displayPageSelectionForm();
    } else if (this.state.displayMode === DisplayMode.IMAGE_PROCESSING_IN_PROGRESS) {
      panel = <ImageProcessingInProgress/>;
    } else {
      panel = <div/>;
    }
    return (panel);
  }

  displayPageSelectionForm() {

    const bookItems = this.state.books.map((book) =>
      <option key={book.id} value={book.id}>{book.name}</option>
    );

    const pageItems = this.state.pages.map((page) =>
      <option key={page.id} value={page.id}>{page.name}</option>
    );

    return <form className="was-validated">
      <div className="mb-3">
        <label htmlFor="book">Book</label>
        <select id="book" className="custom-select" required onChange={e => {
          let bookId = e.target.value;
          this.setState({
            selectedBookId: bookId,
            selectedPageId: null,
            pages: []
          });
          if (bookId !== '') {
            this.setState({
              selectedBookId: bookId,
              selectedPageId: null,
              pages: []            });
            fetch(`${process.env.REACT_APP_REST_API_BASE_NAME}/ocr/train/query/page?bookId=${bookId}`, 
              {
                headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': this.props.googleAccessToken
                }
              })
              .then(rawData => rawData.json())
              .then(pages => this.setState({ pages: pages }))
              .catch(() => this.setState({ hasErrors: true }));            
          }
        } }>
          <option value="">Choose...</option>
          {bookItems}
        </select>
        <div className="invalid-feedback">* Select a Book</div>
      </div>

      <div className="mb-3">
        <label htmlFor="page">Page</label>
        <select id="page" className="custom-select" required onChange={e => {
          this.setState({
            selectedPageId: e.target.value
          });
        } }>
          <option value="">Choose...</option>
          <option value={NEW_PAGE_OPTION}>Add New Page</option>
          {pageItems}
        </select>
        <div className="invalid-feedback">* Select a Page</div>
      </div>

      <button type="button" className="btn btn-success" onClick={this.handleButtonClick}>Submit</button>

    </form>;
  }
}

export default PageSelectionPanel;
