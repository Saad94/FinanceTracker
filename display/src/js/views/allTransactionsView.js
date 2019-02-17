import { elements, classNames } from './base'

export const renderHeader = () => {
    const markup = `
        <tr class="${classNames.dataHeader}">
            <th class="${classNames.dataHeaderDate}" data-key="date">Date</th>
            <th class="${classNames.dataHeaderCategory}" data-key="category">Category</th>
            <th class="${classNames.dataHeaderDescription}" data-key="description">Description</th>
            <th class="${classNames.dataHeaderAmount}" data-key="amount">Amount</th>
        </tr>
    `;
    elements.allTransactions.innerHTML = markup;
}

export const renderTransaction = transaction => {
    const markup = `
        <tr class="${classNames.dataRow} ${transaction.category === 'INCOME' ? classNames.typeIncome : classNames.typeExpense}">
            <td class="${classNames.dataRowDate}">${transaction.date}</td>
            <td class="${classNames.dataRowCategory}">${transaction.category}</td>
            <td class="${classNames.dataRowDescription}">${transaction.description}</td>
            <td class="${classNames.dataRowAmount}">${transaction.amount}</td>
        </tr>
    `;
    elements.allTransactions.insertAdjacentHTML('beforeend', markup);
}

export const renderAllTransactions = transactionsList => {
    renderHeader();
    transactionsList.forEach(renderTransaction);
}