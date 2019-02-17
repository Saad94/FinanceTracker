import Transaction from './models/Transaction';
import * as allTransactionsView from './views/allTransactionsView';
import { elements, classNames } from './views/base';
import { data } from './data/data'

const state = {};
state.transactions = [];
console.log(state.transactions);
state.transactions = JSON.parse(data);
console.log(state.transactions);

allTransactionsView.renderAllTransactions(state.transactions);

const sortNum = (a, b) => a - b;

const sortString = (a, b) => {
    var x = a.toLowerCase();
    var y = b.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

const sortDate = (a, b) => sortNum(Date.parse(a.date), Date.parse(b.date));
const sortCategory = (a, b) => sortString(a.category, b.category);
const sortDescription = (a, b) => sortString(a.description, b.description);
const sortAmount = (a, b) => sortNum(a.amount, b.amount);

const sort = key => {
    if (key === 'date') {
        state.transactions = state.transactions.sort(sortDate);
    } else if (key === 'category') {
        state.transactions = state.transactions.sort(sortCategory);
    } else if (key === 'description') {
        state.transactions = state.transactions.sort(sortDescription);
    } else if (key === 'amount') {
        state.transactions = state.transactions.sort(sortAmount);
    }

    allTransactionsView.renderAllTransactions(state.transactions);
}

// Setting the sort function on the header row.
elements.allTransactions.addEventListener('click', e => {
    if (e.target.matches('.data_header_date, .data_header_category, .data_header_description, .data_header_amount')) {
        sort(e.target.dataset.key);
    }
});