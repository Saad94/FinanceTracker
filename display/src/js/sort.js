const sortNum = (a, b) => a - b;

const sortString = (a, b) => {
    const x = a.toLowerCase();
    const y = b.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

const sortDate = (a, b, order) => sortNum(Date.parse(a.date), Date.parse(b.date)) * order;

const sortCategory = (a, b, order) => {
    const s = sortString(a.category, b.category) * order;
    return s === 0 ? sortDate(a, b) : s;
}

const sortDescription = (a, b, order) => {
    const s = sortString(a.description, b.description) * order;
    return s === 0 ? sortDate(a, b) : s;
}

const sortAmount = (a, b, order) => {
    const s = sortNum(a.amount, b.amount) * order;
    return s === 0 ? sortDate(a, b) : s;
}

export const sort = (transactions, key, lastSort) => {
    const order = lastSort === key ? -1 : 1;

    if (key === 'date') {
        transactions = transactions.sort((a, b) => sortDate(a, b, order));
    } else if (key === 'category') {
        transactions = transactions.sort((a, b) => sortCategory(a, b, order));
    } else if (key === 'description') {
        transactions = transactions.sort((a, b) => sortDescription(a, b, order));
    } else if (key === 'amount') {
        transactions = transactions.sort((a, b) => sortAmount(a, b, order));
    }

    return lastSort === key ? null : key;
}