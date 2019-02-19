import Transaction from './models/Transaction';
import * as allTransactionsView from './views/allTransactionsView';
import { elements, classNames, toDate, calcStartDate, calcEndDate } from './views/base';
import { data } from './data/data'
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import { sort } from './sort'

///////////////////////
/// SET UP VARIABLES
///////////////////////

const state = {
    allTransactions: [],
    transactions: [],
    lastSort: null,
    startDate: null,
    endDate: Date.now(),
    displayedYear: new Date().getFullYear(),
    selectedYear: new Date().getFullYear(),
    selectedMonth: 0
    // selectedMonth: new Date().getMonth()
};

elements.yearValue.textContent = state.displayedYear;
elements.allMonths[state.selectedMonth].classList.add(classNames.monthActive);
state.startDate = calcStartDate(state.selectedYear, state.selectedMonth);
state.endDate = calcEndDate(state.selectedYear, state.selectedMonth);

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

// Setting the click handlers for the month and left/right buttons
elements.sidebar.addEventListener('click', e => {
    if (e.target == elements.leftArrow) {
        allTransactionsView.updateYear(state, -1);
    } else if (e.target == elements.rightArrow) {
        allTransactionsView.updateYear(state, 1);
    } else if (e.target.matches(`.${classNames.month}`)) {
        allTransactionsView.updateMonth(state, e.target.dataset.index);
    }
});

elements.startDate.addEventListener('change', e => {
    elements.endDate.min = elements.startDate.value;
    state.startDate = toDate(elements.startDate.value);

    if (elements.startDate.value) {
        elements.endDate.open();
    }
});

elements.endDate.addEventListener('change', e => {
    elements.startDate.max = elements.endDate.value;
    state.endDate = toDate(elements.endDate.value);
});

elements.search.addEventListener('click', e => {
    elements.allMonths[state.selectedMonth].classList.remove(classNames.monthActive);
    allTransactionsView.calcCurrentTransactions(state);
});

window.state = state;