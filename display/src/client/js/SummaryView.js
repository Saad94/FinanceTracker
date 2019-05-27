import React, { Component } from 'react';
import { chunk } from '../../../public/base';

export default class SummaryView extends Component {
  state = {
    data: null
  };

  totalsTableRowOrderOne = ['Total Savings', 'Total Cash', 'Total Investments'];
  totalsTableRowOrderTwo = ['Total Loans', 'Total Gifts', 'Total Charity'];
  summariesTableRowOrderOne = ['INCOME', 'EXPENSES', 'SAVINGS'];
  summariesTableRowOrderTwo = ['ESSENTIALS', 'ONE_TIME_SPENDING', 'INVESTMENTS', 'LOANS', 'GROCERIES', 'TRANSPORTATION', 'RESTAURANTS', 'FITNESS', 'DANCING'];
  summariesTableRowOrderThree = ['ENTERTAINMENT', 'SUBSCRIPTIONS', 'AIRLINES', 'AMAZON', 'APPAREL', 'GAMING', 'HAIRCUTS', 'GIFTS', 'CHARITY', 'HOTELS', 'MAIL', 'MISC'];

  componentDidMount() {
    this.setState({ fetchInProgress: true });

    fetch('/api/summaries')
      .then(res => res.json())
      .then((res) => {
        delete res.data.summaries.toJSON;
        Object.keys(res.data.summaries).forEach((yyyy) => {
          delete res.data.summaries[yyyy].toJSON;
          Object.keys(res.data.summaries[yyyy]).forEach(mm => delete res.data.summaries[yyyy][mm].toJSON);
        });

        this.setState({
          data: res.data,
          fetchInProgress: false
        });
      });
  }

  renderTotals = totals => (
    <div className="div-totals">
      <table className="table-totals">
        <tbody>
          {
            this.totalsTableRowOrderOne.map(key => (
              <tr className="table-totals-row" key={key}>
                <th>{key}</th>
                <td>{totals[key]}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <table className="table-totals">
        <tbody>
          {
            this.totalsTableRowOrderTwo.map(key => (
              <tr className="table-totals-row" key={key}>
                <th>{key}</th>
                <td>{totals[key]}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );

  renderSummaryTable = (data, year, month) => (
    <table className="table-summaries">
      {
        data === undefined ? <tbody /> : (
          <tbody>
            <tr className="table-summaries-row-heading" key={`${year}-${month}-heading`}>
              <th colSpan={2}>{new Date(parseFloat(year), parseFloat(month) - 1, 1).toLocaleString('en-us', { month: 'long' })}</th>
            </tr>
            {
              this.summariesTableRowOrderOne.map(key => (
                <tr className="table-summaries-row-one" key={`${year}-${month}-${key}`}>
                  <td className={key === 'SAVINGS' ? 'bold' : ''}>{key}</td>
                  <td className={key === 'SAVINGS' ? 'bold' : ''}>{data[key]}</td>
                </tr>
              ))
            }
            {
              this.summariesTableRowOrderTwo.filter(key => key in data && data[key] !== '0.00').map(key => (
                <tr className="table-summaries-row-two" key={`${year}-${month}-${key}`}>
                  <td>{key}</td>
                  <td>{data[key]}</td>
                </tr>
              ))
            }
            {
              this.summariesTableRowOrderThree.filter(key => key in data && data[key] !== '0.00').map(key => (
                <tr className="table-summaries-row-three" key={`${year}-${month}-${key}`}>
                  <td>{key}</td>
                  <td>{data[key]}</td>
                </tr>
              ))
            }
          </tbody>
        )
      }
    </table>
  );

  renderSummaries = summaries => (
    <div>
      {
        Object.keys(summaries).sort().reverse().map((year) => {
          const monthGroups = chunk(Object.keys(summaries[year]).sort().reverse(), 3);

          return (
            <div key={`${year}-data`}>
              <h2>{year}</h2>
              {
                monthGroups.map(monthGroup => (
                  <div className="div-summaries" key={`${year}-${monthGroup}`}>
                    { this.renderSummaryTable(summaries[year][monthGroup[0]], year, monthGroup[0]) }
                    { this.renderSummaryTable(summaries[year][monthGroup[1]], year, monthGroup[1]) }
                    { this.renderSummaryTable(summaries[year][monthGroup[2]], year, monthGroup[2]) }
                  </div>
                ))
              }
            </div>
          );
        })
      }
    </div>
  );

  renderData = () => {
    const { data, fetchInProgress } = this.state;

    if (fetchInProgress) {
      return <div className="lds-hourglass" />;
    }
    if (data === null) {
      return [];
    }

    const { summaries, totals } = data;

    return (
      <div>
        {this.renderTotals(totals)}
        {this.renderSummaries(summaries)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderData()}
      </div>
    );
  }
}
