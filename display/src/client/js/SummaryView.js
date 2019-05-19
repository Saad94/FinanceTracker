import React, { Component } from 'react';

export default class SummaryView extends Component {
  state = {
    data: null
  };

  componentDidMount() {
    this.setState({ fetchInProgress: true });

    fetch('/api/summaries')
      .then(res => res.json())
      .then(res => this.setState({
        data: res.summaries,
        fetchInProgress: false
      }));
  }

  renderSummaries = () => {
    const { data, fetchInProgress } = this.state;

    if (fetchInProgress) {
      return <div className="lds-hourglass" />;
    }

    return data === null ? [] : <p>Summary View</p>;
  }

  render() {
    return (
      <div>
        {this.renderSummaries()}
      </div>
    );
  }
}
