export const classNames = {
  allTransactions: 'all_transactions',
  dataHeader: 'data_header',
  dataHeaderDate: 'data_header_date',
  dataHeaderCategory: 'data_header_category',
  dataHeaderDescription: 'data_header_description',
  dataHeaderAmount: 'data_header_amount',
  dataRow: 'data_row',
  dataRowDate: 'data_element_date',
  dataRowTag: 'data_element_tag',
  dataRowCategory: 'data_element_category',
  dataRowDescription: 'data_element_description',
  dataRowAmount: 'data_element_amount',
  typeAirline: 'type_airline',
  typeAmazon: 'type_amazon',
  typeApparel: 'type_apparel',
  typeCharity: 'type_charity',
  typeDancing: 'type_dancing',
  typeEntertainment: 'type_entertainment',
  typeEssential: 'type_essential',
  typeFitness: 'type_fitness',
  typeGaming: 'type_gaming',
  typeGifts: 'type_gifts',
  typeGroceries: 'type_groceries',
  typeHaircuts: 'type_haircuts',
  typeHotels: 'type_hotels',
  typeIncome: 'type_income',
  typeInvestments: 'type_investments',
  typeLoans: 'type_loans',
  typeMail: 'type_mail',
  typeMedical: 'type_medical',
  typeMisc: 'type_misc',
  typeOneTimeSpending: 'type_one_time_spending',
  typeRestaurants: 'type_restaurants',
  typeSubscriptions: 'type_subscriptions',
  typeTransportation: 'type_transportation',
  root: 'root',
  startDate: 'start_date',
  endDate: 'end_date',
  leftArrow: 'left_arrow',
  rightArrow: 'right_arrow',
  sidebar: 'sidebar',
  month: 'month',
  monthActive: 'month_active',
  year: 'year',
  yearValue: 'year_value',
  search: 'search'
};

export const categoryNames = ['AIRLINES', 'AMAZON', 'APPAREL', 'CHARITY', 'DANCING', 'ENTERTAINMENT', 'ESSENTIALS', 'FITNESS', 'GAMING', 'GIFTS', 'GROCERIES', 'HAIRCUTS', 'HOTELS', 'INCOME', 'INVESTMENTS', 'LOANS', 'MAIL', 'MEDICAL', 'MISC', 'ONE_TIME_SPENDING', 'RESTAURANTS', 'SUBSCRIPTIONS', 'TRANSPORTATION'];

export const categoryToClassName = (category) => {
  switch (category) {
    case 'AIRLINES': return classNames.typeAirline;
    case 'AMAZON': return classNames.typeAmazon;
    case 'APPAREL': return classNames.typeApparel;
    case 'CHARITY': return classNames.typeCharity;
    case 'DANCING': return classNames.typeDancing;
    case 'ENTERTAINMENT': return classNames.typeEntertainment;
    case 'ESSENTIALS': return classNames.typeEssential;
    case 'FITNESS': return classNames.typeFitness;
    case 'GAMING': return classNames.typeGaming;
    case 'GIFTS': return classNames.typeGifts;
    case 'GROCERIES': return classNames.typeGroceries;
    case 'HAIRCUTS': return classNames.typeHaircuts;
    case 'HOTELS': return classNames.typeHotels;
    case 'INCOME': return classNames.typeIncome;
    case 'INVESTMENTS': return classNames.typeInvestments;
    case 'LOANS': return classNames.typeLoans;
    case 'MAIL': return classNames.typeMail;
    case 'MEDICAL': return classNames.typeMedical;
    case 'MISC': return classNames.typeMisc;
    case 'ONE_TIME_SPENDING': return classNames.typeOneTimeSpending;
    case 'RESTAURANTS': return classNames.typeRestaurants;
    case 'SUBSCRIPTIONS': return classNames.typeSubscriptions;
    case 'TRANSPORTATION': return classNames.typeTransportation;
    default: return classNames.typeMisc;
  }
};

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
  allMonths: Array.from(document.querySelectorAll(`.${classNames.month}`)),
  search: document.querySelector(`.${classNames.search}`)
};

export const toDateString = (dateStr) => {
  if (dateStr === '') {
    return 'null';
  }

  const parts = dateStr.split('-');
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
};

export const toDate = dateStr => dateStr === '' ? 'null' : Date.parse(dateStr);

export const numDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

export const calcStartDate = (year, month) => Date.parse(`${year}-${(month + 1).toString().length === 1 ? '0' + (month + 1).toString() : (month + 1).toString()}-01`);

export const calcEndDate = (year, month) => Date.parse(`${year}-${(month + 1).toString().length === 1 ? '0' + (month + 1).toString() : (month + 1).toString()}-${numDaysInMonth(year, month)}`);

export const chunk = (arr, len) => {
  const chunks = [];
  const n = arr.length;
  let i = 0;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
};
