/* eslint-disable no-return-assign */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { categoryNames, toDateString } from '../../../../public/base';

class AddTransaction extends Component {
  // componentDidMount() {
  //   this.start_date.addEventListener('change', this.startDateChangeHandler);
  //   this.end_date.addEventListener('change', this.endDateChangeHandler);
  // }

  // startDateChangeHandler = () => {
  //   const { searchDates, updateSearchDates, } = this.props;
  //   searchDates.startDateValue = this.start_date.value;

  //   this.setState({
  //     endDateMin: this.start_date.value
  //   });

  //   this.end_date.open();

  //   updateSearchDates(searchDates);
  // }

  // endDateChangeHandler = () => {
  //   const { searchDates, updateSearchDates, } = this.props;
  //   searchDates.endDateValue = this.end_date.value;

  //   this.setState({
  //     startDateMax: this.end_date.value
  //   });

  //   updateSearchDates(searchDates);
  // }

  // buttonClickHandler = () => {
  //   const { updateStateFromSearch, } = this.props;
  //   updateStateFromSearch(false);
  // }

  addTransactionButtonHandler = () => {
    const date = toDateString(document.getElementById('add_transaction_date').value);
    const tag = document.getElementById('add_transaction_tag').value;
    const category = document.getElementById('add_transaction_category').value;
    const description = document.getElementById('add_transaction_description').value;
    const amount = parseFloat(parseFloat(document.getElementById('add_transaction_amount').value).toFixed(2));
    const isExpense = document.getElementById('add_transaction_is_expense').value;
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
    if (isNaN(amount) || amount <= 0) {
      document.getElementById('add_transaction_amount').classList.add('add-transaction-table-error');
      error = true;
    } else {
      document.getElementById('add_transaction_amount').classList.remove('add-transaction-table-error');
    }

    if (!error) {
      const { data, updateStateCallback } = this.props;

      const amountWithSign = isExpense === 'True' ? amount * -1.00 : amount;

      const newTransaction = {
        date,
        tag,
        category,
        description,
        amount: amountWithSign
      };

      fetch('/api/create', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ newTransaction })
      })
        .then(res => res.json())
        .then((res) => {
          data.push(res.newTransaction);

          updateStateCallback({
            data,
            showAddTransactionModal: false
          });
        });
    }
  }

  renderCategoryOptions = () => categoryNames.map(category => <option value={category} key={category}>{category}</option>);

  render() {
    const { showAddTransactionModal, updateStateCallback } = this.props;

    if (showAddTransactionModal) {
      return (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={() => updateStateCallback({ showAddTransactionModal: false })}>&times;</span>
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
                  <tr>
                    <th>Is Expense?</th>
                    <td>
                      <select defaultValue="True" id="add_transaction_is_expense">
                        <option value="True" key="True">True</option>
                        <option value="False" key="False">False</option>
                      </select>
                    </td>
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

    return <div />;
  }
}

AddTransaction.propTypes = {
  showAddTransactionModal: PropTypes.bool.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  updateStateCallback: PropTypes.func.isRequired
};

export default AddTransaction;
