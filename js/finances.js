document.addEventListener('DOMContentLoaded', function () {
    const balanceElement = document.getElementById('total-balance');
    const currencySelect = document.getElementById('currency');
    const accountSelect = document.getElementById('account');
    const hiddenAccountSelect = document.getElementById('hidden-account');
    const categorySelect = document.getElementById('category');
    const typeSelect = document.getElementById('type');
    const transactionForm = document.getElementById('transaction-form');
    const accountForm = document.getElementById('account-form');
    const categoryForm = document.getElementById('category-form');
    const transactionHistory = document.getElementById('transaction-history').querySelector('tbody');
    const accountList = document.getElementById('account-list');
    const categoryList = document.getElementById('category-list');
    const exportExcelButton = document.getElementById('export-excel');
    const resetButton = document.getElementById('reset');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let categories = JSON.parse(localStorage.getItem('categories')) || [];

    const currencies = ['MDL', 'USD', 'EUR', 'RUB'];
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        currencySelect.appendChild(option);
    });

    // Обновление баланса
    function updateBalance() {
        let total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        balanceElement.textContent = `Общий баланс: ${total} MDL`;
    }

    // Обновление списка счетов
    function updateAccounts() {
        accountSelect.innerHTML = '';
        hiddenAccountSelect.innerHTML = '';
        accountList.innerHTML = '';

        accounts.forEach((account, index) => {
            // Добавляем счета в выпадающие списки
            const option = document.createElement('option');
            option.value = account.name;
            option.textContent = `${account.name} (${account.balance} ${account.currency})`;
            accountSelect.appendChild(option.cloneNode(true));
            hiddenAccountSelect.appendChild(option);

            // Добавляем счета в список
            const li = document.createElement('li');
            li.innerHTML = `
                ${account.name} (${account.balance} ${account.currency})
                <button onclick="deleteAccount(${index})">Удалить</button>
            `;
            accountList.appendChild(li);
        });
    }

    // Обновление списка категорий
    function updateCategories() {
        categorySelect.innerHTML = '';
        categoryList.innerHTML = '';

        categories.forEach((category, index) => {
            // Добавляем категории в выпадающий список
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);

            // Добавляем категории в список
            const li = document.createElement('li');
            li.innerHTML = `
                ${category.name}
                <button onclick="deleteCategory(${index})">Удалить</button>
            `;
            categoryList.appendChild(li);
        });
    }

    // Обновление истории транзакций
    function updateTransactionHistory() {
        transactionHistory.innerHTML = '';
        transactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.account}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount} ${accounts.find(acc => acc.name === transaction.account)?.currency || ''}</td>
                <td>${transaction.description}</td>
                <td><button onclick="deleteTransaction(${index})">Удалить</button></td>
            `;
            transactionHistory.appendChild(row);
        });
    }

    // Отображение/скрытие скрытого счета при выборе типа "Перевод"
    typeSelect.addEventListener('change', function () {
        const hiddenAccountLabel = document.getElementById('hidden-account-label');
        if (typeSelect.value === 'transfer') {
            hiddenAccountLabel.classList.remove('hidden');
        } else {
            hiddenAccountLabel.classList.add('hidden');
        }
    });

    // Добавление транзакции
    transactionForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const date = document.getElementById('date').value;
        const category = categorySelect.value;
        const account = accountSelect.value;
        const type = typeSelect.value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const hiddenAccount = hiddenAccountSelect.value;

        if (!date || !category || !account || !amount || !description) {
            alert('Заполните все поля!');
            return;
        }

        if (type === 'transfer' && (!hiddenAccount || hiddenAccount === account)) {
            alert('Выберите другой счет для перевода!');
            return;
        }

        transactions.push({ date, category, account, type, amount, description, hiddenAccount });

        if (type === 'transfer') {
            let from = accounts.find(acc => acc.name === account);
            let to = accounts.find(acc => acc.name === hiddenAccount);
            from.balance -= amount;
            to.balance += amount;
        } else if (type === 'income') {
            let acc = accounts.find(acc => acc.name === account);
            acc.balance += amount;
        } else if (type === 'expense') {
            let acc = accounts.find(acc => acc.name === account);
            acc.balance -= amount;
        }

        updateBalance();
        updateAccounts();
        updateTransactionHistory();
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('accounts', JSON.stringify(accounts));
        transactionForm.reset();
    });

    // Добавление счета
    accountForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('account-name').value;
        const balance = parseFloat(document.getElementById('account-balance').value);
        const currency = currencySelect.value;

        if (!name || isNaN(balance)) {
            alert('Заполните все поля корректно!');
            return;
        }

        accounts.push({ name, balance, currency });
        updateAccounts();
        updateBalance();
        localStorage.setItem('accounts', JSON.stringify(accounts));
        accountForm.reset();
    });

    // Добавление категории
    categoryForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('category-name').value;

        if (!name) {
            alert('Введите название категории!');
            return;
        }

        categories.push({ name });
        updateCategories();
        localStorage.setItem('categories', JSON.stringify(categories));
        categoryForm.reset();
    });

    // Удаление транзакции
    window.deleteTransaction = function (index) {
        // Удаляем транзакцию из списка
        transactions.splice(index, 1);

        // Обновляем интерфейс и сохраняем данные
        updateBalance();
        updateAccounts();
        updateTransactionHistory();
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('accounts', JSON.stringify(accounts));
    };

    // Удаление счета
    window.deleteAccount = function (index) {
        accounts.splice(index, 1);
        updateAccounts();
        updateBalance();
        localStorage.setItem('accounts', JSON.stringify(accounts));
    };

    // Удаление категории
    window.deleteCategory = function (index) {
        categories.splice(index, 1);
        updateCategories();
        localStorage.setItem('categories', JSON.stringify(categories));
    };

    // Экспорт в Excel
    exportExcelButton.addEventListener('click', function () {
        const data = transactions.map(transaction => ({
            Дата: transaction.date,
            Категория: transaction.category,
            Счёт: transaction.account,
            Тип: transaction.type,
            Сумма: transaction.amount,
            Валюта: accounts.find(acc => acc.name === transaction.account)?.currency || '',
            Описание: transaction.description
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Транзакции');
        XLSX.writeFile(wb, 'transactions.xlsx');
    });

    // Сброс данных
    resetButton.addEventListener('click', function () {
        localStorage.clear();
        transactions = [];
        accounts = [];
        categories = [];
        updateBalance();
        updateAccounts();
        updateCategories();
        updateTransactionHistory();
    });

    // Инициализация
    updateBalance();
    updateAccounts();
    updateCategories();
    updateTransactionHistory();

    // Переключение видимости разделов
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function () {
            const target = document.getElementById(button.getAttribute('data-target'));
            target.classList.toggle('hidden');
        });
    });
});
