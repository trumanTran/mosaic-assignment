import React, { Component } from 'react';
import './App.css';
import {newsApiKey} from './params.js';

const applyUpdateResult = (previousResult, result, page) => (prevState) => ({
  hits: previousResult.concat(result.articles),
  page: page,
});

const applySetResult = (result, page) => (prevState) => ({
  hits: result.articles,
  page: page,
});

const getNewsURL = (value, page) =>
  `https://newsapi.org/v2/everything?q=${value}&apiKey=${newsApiKey}&page=${page}&pageSize=10`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      page: null,
    };
  }

  onInitialSearch = (e) => {
    e.preventDefault();

    const { value } = this.input;

    if (value === '') {
      return;
    }

    this.fetchStories(value, 1);
  }

  onPaginatedSearch = (e) =>
    this.fetchStories(this.input.value, this.state.page + 1);

  fetchStories = (value, page) =>
    fetch(getNewsURL(value, page))
      .then(response => response.json())
      .then(result => this.onSetResult(result, page));

  onSetResult = (result, page) =>
    page === 1
      ? this.setState(applySetResult(result, page))
      : this.setState(applyUpdateResult(this.state.hits, result, page));

  render() {
    return (
      <div className="page">
        <div className="interactions">
          <form type="submit" onSubmit={this.onInitialSearch}>
            <input type="text" ref={node => this.input = node} />
            <button type="submit">Search</button>
          </form>
        </div>

        <List
          list={this.state.hits}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
        />
      </div>
    );
  }
}

const List = ({ list, page, onPaginatedSearch }) =>
  <div>
    <div className="list">
      {list.map(item => <div className="list-row" key={Math.random()}>
        <a href={item.url} target="_blank">{item.title}</a>
      </div>)}
    </div>

    <div className="interactions">
      {
        page !== null &&
        <button
          type="button"
          onClick={onPaginatedSearch}
        >
          More
        </button>
      }
    </div>
  </div>

export default App;
