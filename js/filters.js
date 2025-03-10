class Filters {
    constructor(transactions, accounts) {
        this.transactions = transactions;
        this.accounts = accounts;
    }

    init() {
        document.getElementById('apply-filters').addEventListener('click', () => this.filterTransactions());
        document.getElementById('reset-filters').addEventListener('click', () => this.resetFilters());
    }

    filterTransactions() {
        const dateFilter = document.getElementById('filter-date').value;
        const categoryFilter = document.getElementById('filter-category').value;
        const typeFilter = document.getElementById('filter-type').value;
        const amountFilter = parseFloat(document.getElementById('filter-amount').value);

        const filteredTransactions = this.transactions.transactions.filter(transaction => {
            return (
                (!dateFilter || transaction.date === dateFilter) &&
                (!categoryFilter || transaction.category === categoryFilter) &&
                (!typeFilter || transaction.type === typeFilter) &&
                (!amountFilter || transaction.amount === amountFilter)
            );
        });

        this.renderTransactionHistory(filteredTransactions);
    }

    renderTransactionHistory(transactionsToRender) {
        const transactionHistory = document.getElementById('transaction-history').querySelector('tbody');
        transactionHistory.innerHTML = '';
        transactionsToRender.forEach((transaction, index) => {
            const amountFormatted = formatMoney(transaction.amount);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.account}</td>
                <td>${transaction.type}</td>
                <td>${amountFormatted} ${this.accounts.accounts.find(acc => acc.name === transaction.account)?.currency || ''}</td>
                <td>${transaction.description}</td>
                <td><button onclick="deleteTransaction(${index})">Удалить</button></td>
            `;
            transactionHistory.appendChild(row);
        });
    }

    resetFilters() {
        document.getElementById('filter-date').value = '';
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-amount').value = '';
        this.renderTransactionHistory(this.transactions.transactions);
    }
}
