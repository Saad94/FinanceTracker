import { elements, classNames, calcStartDate, calcEndDate } from './base'
import { sort } from '../sort'

export const renderTransaction = transaction => {
    const markup = `
        <div class="table-row ${transaction.category === 'INCOME' ? classNames.typeIncome : classNames.typeExpense}">
            <div class="column ${classNames.dataRowDate}">${transaction.date}</div>
            <div class="column ${classNames.dataRowCategory}">${transaction.category}</div>
            <div class="column ${classNames.dataRowDescription}">${transaction.description}</div>
            <div class="column ${classNames.dataRowAmount}">${transaction.amount.toFixed(2)}</div>
        </div>
    `;
    elements.allTransactions.insertAdjacentHTML('beforeend', markup);
}

export const renderAllTransactions = transactionsList => {
    elements.allTransactions.innerHTML = '';
    transactionsList.forEach(renderTransaction);
}

export const sortAndRender = (state, key) => {
    state.lastSort = sort(state.transactions, key, state.lastSort);
    renderAllTransactions(state.transactions);
}

export const calcCurrentTransactions = state => {
    let startIndex = state.startDate === null ? 0 : state.allTransactions.findIndex(t => Date.parse(t.date) >= state.startDate);
    let endIndex = state.endDate === null ? state.allTransactions.length : state.allTransactions.findIndex(t => Date.parse(t.date) > state.endDate);
    endIndex = endIndex === -1 ? state.allTransactions.length : endIndex;

    state.transactions = startIndex === -1 ? [] : state.allTransactions.slice(startIndex, endIndex);

    let key = state.lastSort === null ? 'date' : state.lastSort;
    state.lastSort = null;
    sortAndRender(state, key);
}

export const updateYear = (state, inc) => {
    state.displayedYear = state.displayedYear + inc;
    elements.yearValue.textContent = state.displayedYear;

    if (state.displayedYear !== state.selectedYear) {
        elements.allMonths[state.selectedMonth].classList.remove(classNames.monthActive);
    } else {
        elements.allMonths[state.selectedMonth].classList.add(classNames.monthActive);
    }
}

export const updateMonth = (state, index) => {
    index = parseInt(index);
    elements.allMonths[state.selectedMonth].classList.remove(classNames.monthActive);
    elements.allMonths[index].classList.add(classNames.monthActive);
    state.selectedMonth = index;
    state.selectedYear = state.displayedYear;
    state.startDate = calcStartDate(state.selectedYear, state.selectedMonth);
    state.endDate = calcEndDate(state.selectedYear, state.selectedMonth);
    calcCurrentTransactions(state);
}