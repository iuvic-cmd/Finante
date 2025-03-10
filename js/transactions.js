class Transactions {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.transactionHistory = document.getElementById('transaction-history').querySelector('tbody');
    }

    init() {
        this.updateTransactionHistory();
    }

    addTransaction(date, category, account, type, amount, description, hiddenAccount) {
        this.transactions.push({ date, category, account, type, amount, description, hiddenAccount });
        this.updateTransactionHistory();
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    deleteTransaction(index) {
        this.transactions.splice(index, 1);
        this.updateTransactionHistory();
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    updateTransactionHistory() {
        this.transactionHistory.innerHTML = '';
        this.transactions.forEach((transaction, index) => {
            const amountFormatted = formatMoney(transaction.amount);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.account}</td>
                <td>${transaction.type}</td>
                <td>${amountFormatted} ${accounts.find(acc => acc.name === transaction.account)?.currency || ''}</td>
                <td>${transaction.description}</td>
                <td><button onclick="deleteTransaction(${index})">Удалить</button></td>
            `;
            this.transactionHistory.appendChild(row);
        });
    }
}
