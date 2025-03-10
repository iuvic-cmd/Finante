document.addEventListener('DOMContentLoaded', function () {
    const transactions = new Transactions();
    const accounts = new Accounts();
    const categories = new Categories();
    const filters = new Filters(transactions, accounts);
    const exportImport = new ExportImport(transactions, accounts, categories);

    transactions.init();
    accounts.init();
    categories.init();
    filters.init();
    exportImport.init();
});
