export default class Transaction {
  constructor(id, date, tag, category, description, amount) {
    this.id = id;
    this.date = date;
    this.tag = tag;
    this.category = category;
    this.description = description;
    this.amount = amount;
  }
}
