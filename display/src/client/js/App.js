import React, { Component } from 'react';
import Transaction from './components/Transaction';
import Sidebar from './components/Sidebar';
import { calcStartDate, calcEndDate, toDate, toDateString, categoryNames } from '../../../public/base';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '../css/app.css';
import Search from './components/Search';

export default class App extends Component {
  state = {
    data: null,
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
    console.log('updateStateFromSearch');
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
    console.log('headerClickHandler');
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

  addTransactionHandler = () => {
    this.setState({
      showAddTransactionModal: true
    });
  }

  addTransactionButtonHandler = () => {
    const date = toDateString(document.getElementById('add_transaction_date').value);
    const tag = document.getElementById('add_transaction_tag').value;
    const category = document.getElementById('add_transaction_category').value;
    const description = document.getElementById('add_transaction_description').value;
    const amount = parseFloat(parseFloat(document.getElementById('add_transaction_amount').value).toFixed(2));
    let error = false;

    if (date === 'null') {
      document.getElementById('add_transaction_date_td').classList.add('add-transaction-table-error');
      error = true;
    } else {
      document.getElementById('add_transaction_date_td').classList.remove('add-transaction-table-error');
    }
    if (description === '') {
      document.getElementById('add_transaction_description').classList.add('add-transaction-table-error');
      error = true;
    } else {
      document.getElementById('add_transaction_description').classList.remove('add-transaction-table-error');
    }
    if (isNaN(amount) || amount === 0) {
      document.getElementById('add_transaction_amount').classList.add('add-transaction-table-error');
      error = true;
    } else {
      document.getElementById('add_transaction_amount').classList.remove('add-transaction-table-error');
    }

    if (!error) {
      const { data, } = this.state;

      const newTransaction = {
        date,
        tag,
        category,
        description,
        amount
      };

      fetch('/api/create', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ newTransaction })
      })
        .then(res => res.json())
        .then((res) => {
          data.push(res.newTransaction);

          this.setState({
            data,
            showAddTransactionModal: false
          });
        });
    }
  }

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

  editClickHandler = () => {
    const { edit, } = this.state;

    this.setState({
      edit: !edit
    });
  }

  saveClickHandler = () => {
    const { dirty, data, modifiedIds } = this.state;
    console.log('saveClickHandler', dirty);

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
    console.log('promptSave', dirty);

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

  renderCategoryOptions = () => categoryNames.map(category => <option value={category} key={category}>{category}</option>);

  renderModal = () => {
    const { showAddTransactionModal, } = this.state;

    if (showAddTransactionModal) {
      return (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={() => this.setState({ showAddTransactionModal: false })}>&times;</span>
              <h2>Add Transaction</h2>
            </div>
            <div className="modal-body">
              <table className="add-transaction-table">
                <tbody>
                  <tr>
                    <th>Date</th>
                    <td id="add_transaction_date_td"><vaadin-date-picker placeholder="Pick a date" id="add_transaction_date" /></td>
                  </tr>
                  <tr>
                    <th>Tag</th>
                    <td><input placeholder="tag" id="add_transaction_tag" /></td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>
                      <select defaultValue="MISC" id="add_transaction_category">
                        {this.renderCategoryOptions()}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td><input placeholder="description" id="add_transaction_description" /></td>
                  </tr>
                  <tr>
                    <th>Amount</th>
                    <td><input type="number" placeholder="0.00" id="add_transaction_amount" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="button button-create" id="add_transaction_button" onClick={this.addTransactionButtonHandler}>Create</button>
            </div>
          </div>
        </div>
      );
    }
  };

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
      data, selected, sort, fetchInProgress, searchDates, edit
    } = this.state;

    return (
      <div>
        <div className="header">
          <div className="date_range">
            <Search searchDates={searchDates} updateSearchDates={this.updateSearchDates} updateStateFromSearch={this.updateStateFromSearch} />
          </div>
          <div className="menu-buttons">
            <i className="fas fa-plus menu-button" onClick={this.addTransactionHandler} />
            <i className={`far fa-edit menu-button ${edit ? 'edit' : ''}`} onClick={this.editClickHandler} />
            <i className="far fa-save menu-button" onClick={this.saveClickHandler} />
          </div>
        </div>
        <div className="body">
          {this.renderModal()}
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
