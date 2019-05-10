/* eslint-disable no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Search extends Component {
  state = {
    startDateMin: '',
    startDateMax: '',
    endDateMin: '',
    endDateMax: ''
  };

  componentDidMount() {
    this.start_date.addEventListener('change', this.startDateChangeHandler);
    this.end_date.addEventListener('change', this.endDateChangeHandler);
  }

  startDateChangeHandler = () => {
    const { searchDates, updateSearchDates, } = this.props;
    searchDates.startDateValue = this.start_date.value;

    this.setState({
      endDateMin: this.start_date.value
    });

    this.end_date.open();

    updateSearchDates(searchDates);
  }

  endDateChangeHandler = () => {
    const { searchDates, updateSearchDates, } = this.props;
    searchDates.endDateValue = this.end_date.value;

    this.setState({
      startDateMax: this.end_date.value
    });

    updateSearchDates(searchDates);
  }

  buttonClickHandler = () => {
    const { updateStateFromSearch, } = this.props;
    updateStateFromSearch(false);
  }

  render() {
    const {
      startDateMin, startDateMax, endDateMin, endDateMax
    } = this.state;
    const { searchDates, } = this.props;
    const { startDateValue, endDateValue } = searchDates;

    return (
      <div>
        <vaadin-date-picker ref={elem => this.start_date = elem} label="Start Date" placeholder="Pick a date" id="start_date" value={startDateValue} min={startDateMin} max={startDateMax} />
        <vaadin-date-picker ref={elem => this.end_date = elem} label="End Date" placeholder="Pick a date" id="end_date" value={endDateValue} min={endDateMin} max={endDateMax} />
        <button type="button" className="button" onClick={this.buttonClickHandler}>Search</button>
      </div>
    );
  }
}

Search.propTypes = {
  searchDates: PropTypes.shape({
    startDateValue: PropTypes.string.isRequired,
    endDateValue: PropTypes.string.isRequired
  }).isRequired,
  updateSearchDates: PropTypes.func.isRequired,
  updateStateFromSearch: PropTypes.func.isRequired
};

export default Search;
