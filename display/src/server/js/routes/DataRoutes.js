import * as DataController from '../controllers/DataController';

const express = require('express');

const router = express.Router();

router.get('/data', (req, res) => res.send({
  transactions: DataController.allData()
}));

router.get('/data/:startDate-:endDate', (req, res) => {
  const data = DataController.dataInRange(req);

  res.send({ transactions: data });
});

router.post('/update', (req, res) => {
  DataController.updateTransaction(req);

  res.sendStatus(200);
});

router.post('/create', (req, res) => {
  const newTransaction = DataController.createTransaction(req);

  res.send({ newTransaction });
});

router.post('/delete', (req, res) => {
  DataController.deleteTransaction(req);

  res.sendStatus(200);
});

export default router;
