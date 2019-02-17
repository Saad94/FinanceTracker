export default class Transaction {

    constructor(date, category, description, amount) {
        this.setDate(date);
        this.setCategory(category);
        this.setDescription(description);
        this.setAmount(amount);
    }

    setDate(date) {
        this.date = date;
    }

    setCategory(category) {
        this.category = category;
    }

    setDescription(description) {
        this.description = description;
    }

    setAmount(amount) {
        this.amount = parseFloat(amount);
    }

    update(date, category, description, amount) {
        setDate(date);
        setCategory(category);
        setDescription(description);
        setAmount(amount);
    }
}