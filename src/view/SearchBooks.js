import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { search } from '../BooksAPI';
class SearchBooks extends PureComponent {
  state = {
    searchedBooks: [],
    error: null,
  };

  componentWillUnmount() {
    this.props.changeSearch('');
  }
  search = debounce(value => {
    search(value, 10).then(result => {
      if (!result || result.error) {
        this.setState({ error: result.error });
      } else {
        result = result.map(book => this.props.index.get(book.id) || book);

        this.setState({ searchedBooks: result, error: null });
      }
    });
  }, 200);

  handleSearch = ({ target }) => {
    const { value } = target;
    this.props.changeSearch(value);
    this.search(value);
  };

  closeSearch = event => {
    event.preventDefault();
    this.props.history.goBack();
  };

  render() {
    const { searchedBooks, error } = this.state;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <a
            className="close-search"
            aria-label="close"
            onClick={this.closeSearch}
            href="/"
          />
          <div className="search-books-input-wrapper">
            <input
              onChange={this.handleSearch}
              value={this.props.query}
              type="search"
              placeholder="Search by title or author"
            />
          </div>
        </div>
        <div className="search-books-results">
          {error || this.props.children(searchedBooks)}
        </div>
      </div>
    );
  }
}

export default SearchBooks;
