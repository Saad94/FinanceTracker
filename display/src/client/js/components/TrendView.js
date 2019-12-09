import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { chunk, categoryNames } from '../../../../public/base';

export default class TrendView extends Component {
  state = {
    data: null
  };

  COLORS = {
    AIRLINE: '#f5f7adcc',
    AMAZON: '#ca69cecc',
    APPAREL: '#d8f14bcc',
    CHARITY: '#3fecc1cc',
    DANCING: '#d8a1f8cc',
    ENTERTAINMENT: '#c7fdffcc',
    ESSENTIALS: '#80aed3cc',
    EXPENSES: '#d63737cc',
    FITNESS: '#caababcc',
    GAMING: '#c7fdffcc',
    GIFTS: '#63c0f7cc',
    GROCERIES: '#fdb5b5cc',
    HAIRCUTS: '#a6c6c7cc',
    HOTELS: '#ffc2f7cc',
    INCOME: '#52eb66cc',
    INVESTMENTS: '#ff6767cc',
    LIFETIME_SAVINGS: '#615fe6cc',
    LOANS: '#9b83c0cc',
    MAIL: '#7ecfb4cc',
    MEDICAL: '#729b8ccc',
    MISC: '#e9d3f6cc',
    ONE_TIME_SPENDING: '#f7ba5fcc',
    RESTAURANTS: '#50a0a0cc',
    SAVINGS: '#615fe6cc',
    SUBSCRIPTIONS: '#d1e7a7cc',
    TRANSPORTATION: '#ffc685cc',
  }

  TRENDS_ORDER = ['LIFETIME_SAVINGS', 'INCOME', 'EXPENSES', 'SAVINGS', 'ESSENTIALS', 'ONE_TIME_SPENDING', 'INVESTMENTS', 'LOANS', 'GROCERIES', 'TRANSPORTATION', 'RESTAURANTS', 'FITNESS', 'DANCING', 'MEDICAL', 'ENTERTAINMENT', 'SUBSCRIPTIONS', 'AIRLINES', 'AMAZON', 'APPAREL', 'GAMING', 'HAIRCUTS', 'GIFTS', 'CHARITY', 'HOTELS', 'MAIL', 'MISC'];
  UNACCOUNTED_FOR_KEYS = [...categoryNames].filter(el => !this.TRENDS_ORDER.includes(el));

  componentDidMount() {
    this.setState({ fetchInProgress: true });
    this.TRENDS_ORDER.push(this.UNACCOUNTED_FOR_KEYS);

    fetch('/api/trends/20')
      .then(res => res.json())
      .then((res) => {
        this.setState({
          data: res.data,
          fetchInProgress: false
        });
      });
  }

  renderGraphs = data => (
    <div>
      {
        this.TRENDS_ORDER.map((category) => {
          if (!(category in data)) {
            return '';
          }

          const chartData = {
            labels: [],
            datasets: [
              {
                label: category,
                backgroundColor: this.COLORS[category],
                pointBorderColor: '#00000055',
                pointBackgroundColor: '#00000055',
                data: []
              }
            ]
          };

          Object.keys(data[category]).sort().forEach((datapoint) => {
            chartData.labels.push(datapoint);
            chartData.datasets[0].data.push(data[category][datapoint]);
          });

          return (
            <div className="div-graph" key={category}>
              <Line data={chartData} width={600} height={125} />
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
