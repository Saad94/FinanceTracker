import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../../../public/base';

class Sidebar extends Component {
  state = {
    displayedYear: new Date().getFullYear()
  };

  monthClickHandler = (e) => {
    const { displayedYear, } = this.state;
    const { updateState, sort } = this.props;
    const month = parseInt(e.target.dataset.index, 10);
    const year = displayedYear;

    updateState(month, year, sort, false);
  }

  arrowClickHandler = (type) => {
    const { displayedYear, } = this.state;

    if (type === 'left') {
      this.setState({ displayedYear: displayedYear - 1 });
    } else {
      this.setState({ displayedYear: displayedYear + 1 });
    }
  }

  renderMonths(selectedMonth, selectedYear, displayedYear) {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      .map((month, i) => <div className={`month ${selectedYear === displayedYear && selectedMonth === i ? classNames.monthActive : ''}`} data-index={i} onClick={this.monthClickHandler} key={month}>{month}</div>);
  }

  render() {
    const { displayedYear } = this.state;
    const { selected, } = this.props;

    return (
      <div>
        <div className="year">
          <i className="arrow left_arrow" onClick={() => this.arrowClickHandler('left')} />
          <span className="year_value noselect">{displayedYear}</span>
          <i className="arrow right_arrow" onClick={() => this.arrowClickHandler('right')} />
        </div>
        {this.renderMonths(selected.month, selected.year, displayedYear)}
      </div>
    );
  }
}

Sidebar.propTypes = {
  selected: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired
  }).isRequired,
  sort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired
  }).isRequired,
  updateState: PropTypes.func.isRequired
};

export default Sidebar;
