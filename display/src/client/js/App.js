import React, { Component } from 'react';
import SummaryView from './components/SummaryView';
import TransactionView from './components/TransactionView';
import TrendView from './components/TrendView';
import '../css/app.css';

export default class App extends Component {
  VIEWS = {
    SUMMARIES: 0,
    TRANSACTIONS: 1,
    TRENDS: 2
  }

  state = {
    activeView: this.VIEWS.TRENDS
  };

  changeView = activeView => this.setState({ activeView });

  render() {
    const { activeView } = this.state;

    let viewToRender = null;

    switch (activeView) {
      case this.VIEWS.SUMMARIES:
        viewToRender = <SummaryView />;
        break;
      case this.VIEWS.TRANSACTIONS:
        viewToRender = <TransactionView />;
        break;
      case this.VIEWS.TRENDS:
        viewToRender = <TrendView />;
        break;
      default:
        viewToRender = <TransactionView />;
    }

    return (
      <div>
        <div className="viewSelect">
          <button type="button" className={`button-viewSelect ${activeView === this.VIEWS.TRANSACTIONS ? 'button-viewSelectActive' : ''}`} onClick={() => this.changeView(this.VIEWS.TRANSACTIONS)}>Transactions</button>
          <button type="button" className={`button-viewSelect ${activeView === this.VIEWS.SUMMARIES ? 'button-viewSelectActive' : ''}`} onClick={() => this.changeView(this.VIEWS.SUMMARIES)}>Summaries</button>
          <button type="button" className={`button-viewSelect ${activeView === this.VIEWS.TRENDS ? 'button-viewSelectActive' : ''}`} onClick={() => this.changeView(this.VIEWS.TRENDS)}>Trends</button>
        </div>
        <div className="viewContent">
          {viewToRender}
        </div>
      </div>
    );
  }
}
