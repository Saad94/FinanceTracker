import Transaction from './models/Transaction';
import * as allTransactionsView from './views/allTransactionsView';
import { elements, classNames, toDate } from './views/base';
import { data } from './data/data'
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import { sort } from './sort'

///////////////////////
/// SET UP VARIABLES
///////////////////////

const startDate = elements.startDate;
const endDate = elements.endDate;

const state = {
    allTransactions: [],
    transactions: [],
    lastSort: null,
    startDate: null,
    endDate: Date.now()
};

////////////////////////////////////////////////////////////
/// LOAD THE JSON DATA INTO OUR GLOBAL TRANSACTIONS ARRAY
////////////////////////////////////////////////////////////
JSON.parse(data).forEach(obj => state.allTransactions.push(new Transaction(obj.date, obj.category, obj.description, obj.amount)));
sort(state.allTransactions, 'date', state.lastSort);
allTransactionsView.calcCurrentTransactions(state);

/////////////////////////////////
/// SET UP THE EVENT LISTENERS
/////////////////////////////////

// Setting the sort function click handler on the header row.
elements.allTransactionsHeader.addEventListener('click', e => {
    allTransactionsView.sortAndRender(state, e.target.closest('.column').dataset.key);
});

startDate.addEventListener('change', e => {
    endDate.min = startDate.value;
    state.startDate = toDate(startDate.value);
    allTransactionsView.calcCurrentTransactions(state);

    // Open the second date picker when the user has selected a value
    if (startDate.value) {
        endDate.open();
    }
});

endDate.addEventListener('change', e => {
    startDate.max = endDate.value;
    state.endDate = toDate(endDate.value);
    allTransactionsView.calcCurrentTransactions(state);
});

window.state = state;