import { elements, classNames } from './base'
import { sort } from '../sort'

export const renderHeader = () => {
    // const markup = `
    //     <thead>
    //         <tr class="${classNames.dataHeader}">
    //             <th class="${classNames.dataHeaderDate}" data-key="date">Date</th>
    //             <th class="${classNames.dataHeaderCategory}" data-key="category">Category</th>
    //             <th class="${classNames.dataHeaderDescription}" data-key="description">Description</th>
    //             <th class="${classNames.dataHeaderAmount}" data-key="amount">Amount</th>
    //         </tr>
    //     </thead>
    // `;
    elements.allTransactions.innerHTML = '';
}

export const renderTransaction = transaction => {
    const markup = `
        <tr class="${classNames.dataRow} ${transaction.category === 'INCOME' ? classNames.typeIncome : classNames.typeExpense}">
            <td class="${classNames.dataRowDate}">${transaction.date}</td>
            <td class="${classNames.dataRowCategory}">${transaction.category}</td>
            <td class="${classNames.dataRowDescription}">${transaction.description}</td>
            <td class="${classNames.dataRowAmount}">${transaction.amount.toFixed(2)}</td>
        </tr>
    `;
    elements.allTransactions.insertAdjacentHTML('beforeend', markup);
}

export const renderAllTransactions = transactionsList => {
    renderHeader();
    transactionsList.forEach(renderTransaction);
}

export const sortAndRender = (state, key) => {
    console.log(state);
    console.log(key);
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
    