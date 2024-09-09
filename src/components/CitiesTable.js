import React, { Component } from 'react';
import "../styles/CitiesTable.css";
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

class CitiesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],  // Full list of cities
      filteredCities: [],  // Filtered list of cities based on search
    };
  }

  async componentDidMount() {
    // Fetch cities data
    const response = await fetch(
      'https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=100'
    );
    const data = await response.json();
    const cities = data.records.map((record) => ({
      name: record.fields.name,
      country: record.fields.cou_name_en,
      timezone: record.fields.timezone,
    }));

    this.setState({ cities, filteredCities: cities });
  }

  handleSearch = (query) => {
    // Filter cities based on search query
    const filteredCities = this.state.cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase())
    );
    this.setState({ filteredCities });
  };

  render() {
    return (
      <div>
        <h1 className='main-heading'>Weather Page</h1>
        <SearchBar onSearch={this.handleSearch} />
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Country</th>
              <th>Timezone</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filteredCities.map((city, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/weather/${city.name}`} target="_blank">
                    {city.name}
                  </Link>
                </td>
                <td>{city.country}</td>
                <td>{city.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default CitiesTable;

