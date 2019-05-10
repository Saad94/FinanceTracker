import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classNames, categoryToClassName, categoryNames } from '../../../../public/base';

class Transaction extends Component {
  onChangeHandler = (type, event) => {
    const { transaction, updateCallback, } = this.props;

    if (type === 'tag') {
      transaction.tag = event.target.value;
    } else if (type === 'category') {
      transaction.category = event.target.value;
    } else if (type === 'description') {
      transaction.description = event.target.value;
    } else if (type === 'amount') {
      transaction.amount = parseFloat(parseFloat(event.target.value).toFixed(2));
    }

    updateCallback(transaction);
  }

  renderNormal = transaction => (
    <div className={`table-row ${categoryToClassName(transaction.category)}`}>
      <div className={`column ${classNames.dataRowDate}`}>{transaction.date}</div>
      <div className={`column ${classNames.dataRowTag}`}>{transaction.tag}</div>
      <div className={`column ${classNames.dataRowCategory}`}>{transaction.category}</div>
      <div className={`column ${classNames.dataRowDescription}`}>{transaction.description}</div>
      <div className={`column ${classNames.dataRowAmount}`}>{parseFloat(transaction.amount).toFixed(2)}</div>
    </div>
  )

  renderCategoryOptions = () => categoryNames.map(category => <option value={category} key={category}>{category}</option>);

  renderEditable = (transaction) => {
    const { deleteClickHandler, } = this.props;

    return (
      <div className={`table-row ${categoryToClassName(transaction.category)}`}>
        <div className="column"><i className="far fa-times-circle delete-button" onClick={() => deleteClickHandler(transaction.id)} /></div>
        <div className={`column ${classNames.dataRowDate}`}>{transaction.date}</div>
        <input className={`column ${classNames.dataRowTag}`} defaultValue={transaction.tag} onChange={event => this.onChangeHandler('tag', event)} />
        <select className={`column ${classNames.dataRowCategory}`} defaultValue={transaction.category} onChange={event => this.onChangeHandler('category', event)}>
          {this.renderCategoryOptions()}
        </select>
        <input className={`column ${classNames.dataRowDescription}`} defaultValue={transaction.description} onChange={event => this.onChangeHandler('description', event)} />
        <input type="number" className={`column ${classNames.dataRowAmount}`} defaultValue={parseFloat(transaction.amount).toFixed(2)} onChange={event => this.onChangeHandler('amount', event)} />
      </div>
    );
  };

  render() {
    const { edit, transaction, } = this.props;

    return edit ? this.renderEditable(transaction) : this.renderNormal(transaction);
  }
}

Transaction.propTypes = {
  transaction: PropTypes.shape({
    date: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  updateCallback: PropTypes.func.isRequired,
  deleteClickHandler: PropTypes.func.isRequired
};

export default Transaction;
