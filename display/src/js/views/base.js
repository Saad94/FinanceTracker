export const classNames = {
    allTransactions: 'all_transactions',
    allTransactionsHeader: 'all_transactions_header',
    dataHeader: 'data_header',
    dataHeaderDate: 'data_header_date',
    dataHeaderCategory: 'data_header_category',
    dataHeaderDescription: 'data_header_description',
    dataHeaderAmount: 'data_header_amount',
    dataRow: 'data_row',
    dataRowDate: 'data_element_date',
    dataRowCategory: 'data_element_category',
    dataRowDescription: 'data_element_description',
    dataRowAmount: 'data_element_amount',
    typeIncome: 'type_income',
    typeExpense: 'type_expense',
    root: 'root',
    startDate: 'start_date',
    endDate: 'end_date'
}

export const elements = {
    allTransactions: document.querySelector(`.${classNames.allTransactions}`),
    allTransactionsHeader: document.querySelector(`.${classNames.allTransactionsHeader}`),
    root: document.querySelector(`.${classNames.root}`),
    startDate: document.querySelector(`#${classNames.startDate}`),
    endDate: document.querySelector(`#${classNames.endDate}`)
};

export const toDate = dateStr => {
    const parts = dateStr.split('-');
    return Date.parse(parts[1] + '/' + parts[2] + '/' + parts[0]);
}