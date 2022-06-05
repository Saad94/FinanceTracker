import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { chunk, categoryNames } from '../../../../public/base';

export default class TrendView extends Component {
  state = {
    categoryBasedData: null,
    dateBasedData: null
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

  TRENDS_ORDER = [
    'ESSENTIALS',
    'ONE_TIME_SPENDING',
    'INVESTMENTS',
    'LOANS',
    'GROCERIES',
    'TRANSPORTATION',
    'RESTAURANTS',
    'FITNESS',
    'DANCING',
    'MEDICAL',
    'ENTERTAINMENT',
    'SUBSCRIPTIONS',
    'AIRLINES',
    'AMAZON',
    'APPAREL',
    'GAMING',
    'HAIRCUTS',
    'GIFTS',
    'CHARITY',
    'HOTELS',
    'MAIL',
    'MISC'
  ];

  componentDidMount() {
    this.setState({ fetchInProgress: true });

    fetch('/api/trends/36')
      .then(res => res.json())
      .then((res) => {
        this.setState({
          categoryBasedData: res.data,
          fetchInProgress: false
        });
      });

    fetch('/api/trends2/36')
      .then(res => res.json())
      .then((res) => {
        this.setState({
          dateBasedData: res.data,
          fetchInProgress: false
        });
      });
  }

  renderLineGraphs = (categories) => {
    const data = this.state.categoryBasedData;

    return (
      <div>
        {
          categories.map((category) => {
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
  };

  renderBarGraphs = (categories) => {
    const data = this.state.dateBasedData;
    const chartData = {
      labels: [],
      datasets: []
    };
    const datasetsMap = {};

    Object.keys(data).sort().forEach((key) => {
      chartData.labels.push(key);
      categories.map((category) => {
        if (!(category in datasetsMap)) {
          datasetsMap[category] = [];
        }
        datasetsMap[category].push(data[key][category]);
      });
    });

    Object.keys(datasetsMap).sort().forEach((category) => {
      chartData.datasets.push(
        {
          label: category,
          backgroundColor: this.COLORS[category],
          pointBorderColor: '#00000055',
          pointBackgroundColor: '#00000055',
          data: datasetsMap[category]
        }
      );
    });

    const options = {
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      },
      barShowStroke: false
    };

    return <Bar data={chartData} options={options} width={600} height={125} />;
  };

  renderGraphData = () => {
    const { categoryBasedData, dateBasedData, fetchInProgress } = this.state;

    if (fetchInProgress) {
      return <div className="lds-hourglass" />;
    }
    if (categoryBasedData === null || dateBasedData === null) {
      return [];
    }

    return (
      <div>
        {this.renderLineGraphs(['LIFETIME_SAVINGS'])}
        {this.renderBarGraphs(['EXPENSES', 'SAVINGS'])}
        {
          this.TRENDS_ORDER.map((category) => {
            return this.renderBarGraphs([category])
          })
        }
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderGraphData()}
      </div>
    );
  }
}
