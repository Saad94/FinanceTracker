import React, { Component } from 'react';
import AddTransaction from './AddTransaction';
import Search from './Search';
import Sidebar from './Sidebar';
import Transaction from './Transaction';
import { calcStartDate, calcEndDate, toDate } from '../../../../public/base';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';

export default class TransactionView extends Component {
  state = {
    data: [],
    modifiedIds: new Set(),
    selected: {
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    },
    sort: {
      key: 'date',
      order: 'asc'
    },
    searchDates: {
      startDateValue: '',
      endDateValue: ''
    },
    edit: false,
    dirty: false,
    activeHeader: 'date',
    showAddTransactionModal: false
  };

  componentDidMount() {
    const { selected, sort, } = this.state;
    this.updateState(selected.month, selected.year, sort);
  }

  updateState = (month, year, sort, alreadyPromptedSave) => {
    if (!alreadyPromptedSave) {
      this.promptSave();
    }
    const startDate = calcStartDate(year, month);
    const endDate = calcEndDate(year, month);
    const { key, order } = sort;
    const params = `?key=${key}&order=${order}`;
    this.setState({ fetchInProgress: true });

    fetch(`/api/data/${startDate}-${endDate}${params}`)
      .then(res => res.json())
      .then(res => this.setState({
        data: res.transactions,
        selected: {
          month,
          year
        },
        sort,
        fetchInProgress: false,
        searchDates: {
          startDateValue: '',
          endDateValue: ''
        }
      }));
  }

  updateSearchDates = (searchDates) => {
    this.setState({
      searchDates
    });
  }

  updateStateFromSearch = (alreadyPromptedSave) => {
    if (!alreadyPromptedSave) {
      this.promptSave();
    }
    const { searchDates, sort } = this.state;
    const { startDateValue, endDateValue } = searchDates;
    const { key, order } = sort;
    const startDate = toDate(startDateValue);
    const endDate = toDate(endDateValue);
    const params = `?key=${key}&order=${order}`;

    fetch(`/api/data/${startDate}-${endDate}${params}`)
      .then(res => res.json())
      .then(res => this.setState({
        data: res.transactions,
        selected: {
          month: -1,
          year: -1
        },
        sort,
        fetchInProgress: false
      }));
  }

  headerClickHandler = (key) => {
    this.promptSave();
    const { selected, sort, } = this.state;

    if (sort.key === key) {
      if (sort.order === 'asc') {
        sort.order = 'desc';
      } else {
        sort.order = 'asc';
      }
    } else {
      sort.key = key;
      sort.order = 'asc';
    }

    this.setState({ activeHeader: key });

    if (selected.month === -1) {
      this.updateStateFromSearch(true);
    } else {
      this.updateState(selected.month, selected.year, sort, true);
    }
  }

  updateStateCallback = stateMap => this.setState(stateMap);

  deleteClickHandler = (id) => {
    const { data, } = this.state;

    if (confirm('Are you sure you want to delete this Transaction?')) {
      fetch('/api/delete', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ id })
      })
        .then(() => {
          data.splice(data.findIndex(el => el.id === id), 1);

          this.setState({
            data
          });
        });
    }
  }

  saveClickHandler = () => {
    const { data, modifiedIds } = this.state;

    const modifiedData = Array.from(modifiedIds).map(id => data[data.findIndex(el => el.id === id)]);
    modifiedIds.clear();

    this.setState({ fetchInProgress: true });

    fetch('/api/update', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ modifiedData })
    })
      .then(() => this.setState({
        edit: false,
        dirty: false,
        fetchInProgress: false,
        modifiedIds
      }));
  }

  promptSave = () => {
    const { dirty, } = this.state;

    if (dirty) {
      if (confirm('You\'ve modified some data. Do you want to save your changes?')) {
        this.saveClickHandler();
      } else {
        this.setState({ dirty: false });
      }
    }
  }

  updateCallback = (transaction) => {
    const { data, modifiedIds } = this.state;

    data[data.findIndex(el => el.id === transaction.id)] = transaction;
    modifiedIds.add(transaction.id);

    this.setState({
      data,
      dirty: true,
      modifiedIds
    });
  }

  renderTransactions = (fetchInProgress, transactions) => {
    const { edit, } = this.state;

    if (fetchInProgress) {
      return <div className="lds-hourglass" />;
    }

    return transactions === null ? [] : transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} edit={edit} updateCallback={this.updateCallback} deleteClickHandler={this.deleteClickHandler} />);
  }

  renderHeader = () => {
    const { edit, activeHeader, } = this.state;

    const headers = ['date', 'tag', 'category', 'description', 'amount'].map(type => <div className={`column data_header_${type} noselect ${type === activeHeader ? 'data_header_active' : ''}`} data-key={type} key={type} onClick={() => this.headerClickHandler(type)}>{type[0].toUpperCase() + type.substr(1)}</div>);

    if (edit) {
      headers.unshift(<div className="column data_header_delete" key="delete" />);
    }

    return headers;
  }

  render() {
    const {
      data, selected, sort, fetchInProgress, searchDates, edit, showAddTransactionModal
    } = this.state;

    return (
      <div>
        <div className="header">
          <div className="date_range">
            <Search searchDates={searchDates} updateSearchDates={this.updateSearchDates} updateStateFromSearch={this.updateStateFromSearch} />
          </div>
          <div className="menu-buttons">
            <i className="fas fa-plus menu-button" onClick={() => this.updateStateCallback({ showAddTransactionModal: true })} />
            <i className={`far fa-edit menu-button ${edit ? 'edit' : ''}`} onClick={() => this.updateStateCallback({ edit: !edit })} />
            <i className="far fa-save menu-button" onClick={this.saveClickHandler} />
          </div>
        </div>
        <div className="body">
          <AddTransaction showAddTransactionModal={showAddTransactionModal} data={data} updateStateCallback={this.updateStateCallback} />
          <div className="sidebar">
            <Sidebar selected={selected} sort={sort} updateState={this.updateState} />
          </div>
          <div className="container">
            <div className="table-row data_header">
              {this.renderHeader()}
            </div>
            <div className="all_transactions">
              {this.renderTransactions(fetchInProgress, data)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
