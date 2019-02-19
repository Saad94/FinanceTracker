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
    root: 'root',
    startDate: 'start_date',
    endDate: 'end_date',
    leftArrow: 'left_arrow',
    rightArrow: 'right_arrow',
    sidebar: 'sidebar',
    month: 'month',
    monthActive: 'month_active',
    year: 'year',
    yearValue: 'year_value'
}

export const elements = {
    allTransactions: document.querySelector(`.${classNames.allTransactions}`),
    allTransactionsHeader: document.querySelector(`.${classNames.dataHeader}`),
    root: document.querySelector(`.${classNames.root}`),
    startDate: document.querySelector(`#${classNames.startDate}`),
    endDate: document.querySelector(`#${classNames.endDate}`),
    leftArrow: document.querySelector(`.${classNames.leftArrow}`),
    rightArrow: document.querySelector(`.${classNames.rightArrow}`),
    sidebar: document.querySelector(`.${classNames.sidebar}`),
    year: document.querySelector(`.${classNames.year}`),
    yearValue: document.querySelector(`.${classNames.yearValue}`),
    allMonths: Array.from(document.querySelectorAll('.month'))
};

export const toDate = dateStr => {
    const parts = dateStr.split('-');
    return Date.parse(parts[1] + '/' + parts[2] + '/' + parts[0]);
}

export const numDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

export const calcStartDate = (year, month) => Date.parse(`${(month+1).toString().length === 1 ? '0' + (month+1).toString() : (month+1).toString()}/01/${year}`);

export const calcEndDate = (year, month) => Date.parse(`${(month+1).toString().length === 1 ? '0' + (month+1).toString() : (month+1).toString()}/${numDaysInMonth(year, month)}/${year}`);