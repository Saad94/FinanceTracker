import { elements, classNames, calcStartDate, calcEndDate } from './base'
import { sort } from '../sort'

const categoryToClassName = category => {
    switch (category) {
        case 'INCOME': return classNames.typeIncome;
        case 'AIRLINES': return classNames.typeAirline;
        case 'CLIMBING': return classNames.typeClimbing;
        case 'DANCING': return classNames.typeDancing;
        case 'ESSENTIALS': return classNames.typeEssential;
        case 'TRANSPORTATION': return classNames.typeTransportation;
        case 'GROCERIES': return classNames.typeGroceries;
        case 'AMAZON': return classNames.typeGroceries;
        case 'ENTERTAINMENT': return classNames.typeEntertainment;
        case 'HOTELS': return classNames.typeHotels;
        case 'INVESTMENTS': return classNames.typeInvestments;
        default: return classNames.typeMisc;
    }
}

export const renderTransaction = transaction => {
    const markup = `
        <div class="table-row ${categoryToClassName(transaction.category)}">
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
    elements.startDate.value = "";
    elements.endDate.value = "";
    index = parseInt(index);
    elements.allMonths[state.selectedMonth].classList.remove(classNames.monthActive);
    elements.allMonths[index].classList.add(classNames.monthActive);
    state.selectedMonth = index;
    state.selectedYear = state.displayedYear;
    state.startDate = calcStartDate(state.selectedYear, state.selectedMonth);
    state.endDate = calcEndDate(state.selectedYear, state.selectedMonth);
    calcCurrentTransactions(state);
}