export const classNames = {
    allTransactions: 'all_transactions',
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
    root: 'root'
}

export const elements = {
    allTransactions: document.querySelector(`.${classNames.allTransactions}`),
    root: document.querySelector(`.${classNames.root}`)
};