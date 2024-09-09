import React, { Component } from 'react';
import "../styles/SearchBar.css";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      suggestions: [],
    };
  }

  handleInputChange = async (event) => {
    const query = event.target.value;
    this.setState({ query });

    // Fetch cities based on query (API for cities autocomplete)
    if (query.length > 2) {
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${query}&rows=5`
      );
      const data = await response.json();
      const suggestions = data.records.map((record) => record.fields.name);
      this.setState({ suggestions });
    } else {
      this.setState({ suggestions: [] });
    }
  };

  handleSuggestionClick = (suggestion) => {
    this.setState({ query: suggestion, suggestions: [] });
    this.props.onSearch(suggestion);  // Call the parent’s search function
  };

  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          value={this.state.query}
          onChange={this.handleInputChange}
          placeholder="Search for a city..."
        />
        {this.state.suggestions.length > 0 && (
          <ul className="suggestions-list">
            {this.state.suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => this.handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default SearchBar;


