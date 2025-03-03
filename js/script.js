// Загрузка данных из localStorage
let debts = JSON.parse(localStorage.getItem('debts')) || [];

// Функция для отображения списка долгов
function renderDebts() {
    const debtList = document.getElementById('debtList');
    debtList.innerHTML = '';

    debts.forEach((debt, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${debt.debtor}</strong> - ${debt.amount} ${debt.currency} (${debt.type === 'owed' ? 'Мне должны' : 'Я должен'})
            <br>Дата: ${debt.dueDate}
            <br>Описание: ${debt.description}
            <button onclick="deleteDebt(${index})">Удалить</button>
        `;
        debtList.appendChild(li);
    });
}

// Функция для добавления долга
document.getElementById('debtForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const debtType = document.getElementById('debtType').value;
    const debtor = document.getElementById('debtor').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const dueDate = document.getElementById('dueDate').value;
    const description = document.getElementById('description').value;

    if (!debtor || !amount || !dueDate) {
        alert('Заполните все обязательные поля!');
        return;
    }

    debts.push({
        type: debtType,
        debtor,
        amount,
        currency,
        dueDate,
        description
    });

    localStorage.setItem('debts', JSON.stringify(debts));
    renderDebts();
    document.getElementById('debtForm').reset();
});

// Функция для удаления долга
function deleteDebt(index) {
    debts.splice(index, 1);
    localStorage.setItem('debts', JSON.stringify(debts));
    renderDebts();
}

// Функция для сброса всех долгов
document.getElementById('resetButton').addEventListener('click', function() {
    debts = [];
    localStorage.setItem('debts', JSON.stringify(debts));
    renderDebts();
});

// Функция для экспорта в Excel
document.getElementById('exportButton').addEventListener('click', function() {
    const data = debts.map(debt => ({
        Тип: debt.type === 'owed' ? 'Мне должны' : 'Я должен',
        Имя: debt.debtor,
        Сумма: debt.amount,
        Валюта: debt.currency,
        Дата: debt.dueDate,
        Описание: debt.description
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Долги');
    XLSX.writeFile(wb, 'debts.xlsx');
});

// Функция для сворачивания/разворачивания списка долгов
document.getElementById('toggleDebtList').addEventListener('click', function() {
    const debtList = document.getElementById('debtList');
    if (debtList.style.display === 'none') {
        debtList.style.display = 'block';
        this.textContent = 'Скрыть историю долгов';
    } else {
        debtList.style.display = 'none';
        this.textContent = 'Показать историю долгов';
    }
});

// Инициализация при загрузке страницы
renderDebts();

// Добавление активного класса для текущей страницы
const currentPage = window.location.pathname.split('/').pop(); // Получаем имя текущей страницы
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});
