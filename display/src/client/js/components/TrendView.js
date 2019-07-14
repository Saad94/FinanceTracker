import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import * as chartjs from "chart.js";
import { chunk } from '../../../../public/base';

export default class TrendView extends Component {
  state = {
    data: null
  };

  totalsTableRowOrderOne = ['Total Savings', 'Total Cash', 'Total Investments'];
  totalsTableRowOrderTwo = ['Total Loans', 'Total Gifts', 'Total Charity'];
  summariesTableRowOrderOne = ['INCOME', 'EXPENSES', 'SAVINGS'];
  summariesTableRowOrderTwo = ['ESSENTIALS', 'ONE_TIME_SPENDING', 'INVESTMENTS', 'LOANS', 'GROCERIES', 'TRANSPORTATION', 'RESTAURANTS', 'FITNESS', 'DANCING', 'MEDICAL'];
  summariesTableRowOrderThree = ['ENTERTAINMENT', 'SUBSCRIPTIONS', 'AIRLINES', 'AMAZON', 'APPAREL', 'GAMING', 'HAIRCUTS', 'GIFTS', 'CHARITY', 'HOTELS', 'MAIL', 'MISC'];

  componentDidMount() {
    this.setState({ fetchInProgress: true });

    fetch('/api/trends/12')
      .then(res => res.json())
      .then((res) => {
        console.log(res.data);

        this.setState({
          data: res.data,
          fetchInProgress: false
        });
      });
  }

  renderGraphs = data => (
    <div>
      {
        Object.keys(data).map((category) => {
          const chartData = {
            labels: [],
            datasets: [
              {
                label: category,
                backgroundColor: 'rgba(255, 0, 255, 0.2)',
                strokeColor: 'rgba(220, 220, 220, 1)',
                pointColor: 'rgba(220, 220, 220, 1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                data: []
              }
            ]
          };

          Object.keys(data[category]).sort().forEach((datapoint) => {
            chartData.labels.push(datapoint);
            chartData.datasets[0].data.push(data[category][datapoint]);
          });

          return <Line data={chartData} width={600} height={150} />;
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

    return (
      <div>
        {this.renderGraphs(data)}
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
