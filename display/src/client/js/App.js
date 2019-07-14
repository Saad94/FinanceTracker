import React, { Component } from 'react';
import SummaryView from './SummaryView';
import TransactionView from './TransactionView';

export default class App extends Component {
  state = {
    summaryView: true
  };

  buttonClickHandler = flag => this.setState({ summaryView: flag });

  render() {
    const { summaryView } = this.state;

    return (
      <div>
        <div className="viewSelect">
          <button type="button" className={`button-viewSelect ${!summaryView ? 'button-viewSelectActive' : ''}`} onClick={() => this.buttonClickHandler(false)}>Transactions</button>
          <button type="button" className={`button-viewSelect ${summaryView ? 'button-viewSelectActive' : ''}`} onClick={() => this.buttonClickHandler(true)}>Summaries</button>
        </div>
        <div className="viewContent">
          {summaryView ? <SummaryView /> : <TransactionView />}
        </div>
      </div>
    );
  }
}
