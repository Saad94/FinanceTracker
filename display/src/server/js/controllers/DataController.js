import Transaction from '../models/Transaction';
import sort from '../sort';

require('dotenv').config();

const fs = require('fs');

class DefaultDict {
  constructor(DefaultInit) {
    return new Proxy({}, {
      get: (target, name) => name in target ? target[name] : (target[name] = typeof DefaultInit === 'function' ? new DefaultInit().valueOf() : DefaultInit)
    });
  }
}

const encrypt = (data) => {
  const key = process.env.KEY;
  let result = '';

  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(key.charCodeAt([i % key.length]) ^ data.charCodeAt(i));
  }

  return result;
};

// Make a backup of the data file
const dataDir = `${__dirname}/../../data/`;
const filePath = `${dataDir}data.json`;
const backupFilePath = `${dataDir}data-${new Date().toJSON().slice(0, 19).replace(/[-:T]/g, '')}.json`;
console.log(filePath);
console.log(backupFilePath);
fs.copyFile(filePath, backupFilePath, (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});

// Load the JSON data and parse it into Transactions.
const encryptedJson = fs.readFileSync(filePath, 'utf-8');
const jsonData = JSON.parse(encrypt(encryptedJson));
const allTransactions = jsonData.map(t => new Transaction(t.id, t.date, t.tag, t.category, t.description, t.amount));
sort(allTransactions, 'date', 'asc');


const calculateSummaries = () => {
  sort(allTransactions, 'date', 'asc');
  const summaries = new DefaultDict(() => new DefaultDict(() => new DefaultDict(0)));

  allTransactions.forEach((t) => {
    const [mm, dd, yyyy] = t.date.split('/');

    if (t.category === 'INCOME') {
      summaries[yyyy][mm]['income'] += t.amount;
    } else if (t.category === 'INVESTMENTS') {
      summaries[yyyy][mm]['investments'] += t.amount;
    } else {
      summaries[yyyy][mm]['expenses'] += t.amount;

      if (t.category === 'GIFTS') {
        summaries[yyyy][mm]['gifts'] += t.amount;
      } else if (t.category === 'LOANS') {
        summaries[yyyy][mm]['loans'] += t.amount;
      } else if (t.category === 'CHARITY') {
        summaries[yyyy][mm]['charity'] += t.amount;
      }
    }
  });

  let totalSavings = 0;
  let totalLoans = 0;
  let totalGifts = 0;
  let totalCharity = 0;
  let totalInvestments = 0;

  Object.keys(summaries).sort().forEach((yyyy) => {
    Object.keys(summaries[yyyy]).sort().forEach((mm) => {
      const data = summaries[yyyy][mm];

      data['savings'] = data['income'] + data['expenses'];

      totalSavings += data['savings'];
      totalLoans += data['loans'];
      totalGifts += data['gifts'];
      totalCharity += data['charity'];
      totalInvestments += data['investments'];

      data['totalSavings'] = totalSavings;
      data['totalLoans'] = totalLoans;
      data['totalGifts'] = totalGifts;
      data['totalCharity'] = totalCharity;
      data['totalInvestments'] = totalInvestments;
    });
  });

  Object.keys(summaries).sort().forEach((yyyy) => {
    Object.keys(summaries[yyyy]).sort().forEach((mm) => {
      Object.keys(summaries[yyyy][mm]).sort().forEach((key) => {
        summaries[yyyy][mm][key] = summaries[yyyy][mm][key].toFixed(2);
      });
    });
  });

  return summaries;
};

const calcCurrentTransactions = (startDate, endDate) => {
  const startIndex = startDate === null ? 0 : allTransactions.findIndex((t) => {
    const parts = t.date.split('/');
    return Date.parse(`${parts[2]}-${parts[0]}-${parts[1]}`) >= startDate;
  });

  let endIndex = endDate === null ? allTransactions.length : allTransactions.findIndex((t) => {
    const parts = t.date.split('/');
    return Date.parse(`${parts[2]}-${parts[0]}-${parts[1]}`) > endDate;
  });

  endIndex = endIndex === -1 ? allTransactions.length : endIndex;

  return startIndex === -1 ? [] : allTransactions.slice(startIndex, endIndex);
};

export const allData = () => allTransactions;

export const dataInRange = (req) => {
  const startDate = req.params.startDate === 'null' ? null : req.params.startDate;
  const endDate = req.params.endDate === 'null' ? null : req.params.endDate;
  const transactions = calcCurrentTransactions(startDate, endDate);
  sort(transactions, req.query.key, req.query.order);
  return transactions;
};

export const updateTransaction = (req) => {
  const newData = req.body.modifiedData;
  newData.forEach((transaction) => {
    allTransactions[allTransactions.findIndex(el => el.id === transaction.id)] = transaction;
  });

  // Write the new data to disk
  fs.writeFileSync(filePath, encrypt(JSON.stringify(allTransactions)));
};

export const createTransaction = (req) => {
  const t = req.body.newTransaction;
  const id = Math.max.apply(Math, allTransactions.map(t => t.id ));

  const newTransaction = new Transaction(id + 1, t.date, t.tag, t.category, t.description, t.amount);

  allTransactions.push(newTransaction);
  sort(allTransactions, 'date', 'asc');

  // Write the new data to disk
  fs.writeFileSync(filePath, encrypt(JSON.stringify(allTransactions)));

  return newTransaction;
};

export const deleteTransaction = (req) => {
  const { id, } = req.body;

  allTransactions.splice(allTransactions.findIndex(el => el.id === id), 1);

  // Write the new data to disk
  fs.writeFileSync(filePath, encrypt(JSON.stringify(allTransactions)));
};

export const allSummaries = () => calculateSummaries();
