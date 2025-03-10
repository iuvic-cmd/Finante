class ExportImport {
    constructor(transactions, accounts, categories) {
        this.transactions = transactions;
        this.accounts = accounts;
        this.categories = categories;
    }

    init() {
        document.getElementById('export-backup').addEventListener('click', () => this.exportData());
        document.getElementById('import-backup').addEventListener('change', (event) => this.importData(event));
    }

    exportData() {
        const data = {
            transactions: this.transactions.transactions,
            accounts: this.accounts.accounts,
            categories: this.categories.categories
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finances_backup.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            this.transactions.transactions = data.transactions || [];
            this.accounts.accounts = data.accounts || [];
            this.categories.categories = data.categories || [];

            localStorage.setItem('transactions', JSON.stringify(this.transactions.transactions));
            localStorage.setItem('accounts', JSON.stringify(this.accounts.accounts));
            localStorage.setItem('categories', JSON.stringify(this.categories.categories));

            this.transactions.updateTransactionHistory();
            this.accounts.updateAccounts();
            this.categories.updateCategories();
        };
        reader.readAsText(file);
    }
}
