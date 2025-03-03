// Обработчик отправки формы
document.getElementById('creditForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addCredit();
});

// Обработчик изменения типа кредита
document.getElementById('creditType').addEventListener('change', function() {
    const rateField = document.getElementById('creditRate');
    if (this.value === 'lombard' || this.value === 'installment') {
        rateField.style.display = 'none'; // Скрываем поле для ломбарда и рассрочки
    } else {
        rateField.style.display = 'block'; // Показываем поле для стандартного кредита
    }
});

// Функция добавления кредита
function addCredit() {
    const name = document.getElementById('creditName').value;
    const date = document.getElementById('creditDate').value;
    const term = parseInt(document.getElementById('creditTerm').value);
    const type = document.getElementById('creditType').value;
    const rate = type === 'installment' ? 0 : (type === 'lombard' ? 2 : parseFloat(document.getElementById('creditRate').value));
    const amount = parseFloat(document.getElementById('creditAmount').value);

    const credit = {
        name,
        date,
        term,
        type,
        rate,
        amount,
        remainingMonths: term,
        remainingAmount: amount,
        payments: generatePaymentSchedule(amount, term, rate, date, type)
    };

    saveCredit(credit);
    updateCreditHistory();
    document.getElementById('creditForm').reset();
}

// Генерация графика платежей
function generatePaymentSchedule(amount, term, rate, startDate, type) {
    const payments = [];
    let remainingAmount = amount;

    for (let i = 1; i <= term; i++) {
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(paymentDate.getMonth() + i);

        let payment = 0;
        let interest = 0;

        if (type === 'standard') {
            // Стандартный кредит с процентами
            const monthlyRate = rate / 100 / 12;
            payment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
            interest = remainingAmount * monthlyRate;
            remainingAmount -= (payment - interest);
        } else if (type === 'installment') {
            // Рассрочка без процентов
            payment = amount / term;
            remainingAmount -= payment;
        } else if (type === 'lombard') {
            // Ломбард: платим только проценты (2% в месяц)
            interest = amount * (rate / 100);
            payment = interest;
            // Основной долг не уменьшается
        }

        payments.push({
            month: paymentDate.toLocaleDateString('ru-RU'), // Формат: dd.mm.yyyy
            payment: payment.toFixed(2),
            status: 'Не оплачен',
            type: type
        });
    }

    return payments;
}

// Сохранение кредита в localStorage
function saveCredit(credit) {
    let credits = JSON.parse(localStorage.getItem('credits')) || [];
    credits.push(credit);
    localStorage.setItem('credits', JSON.stringify(credits));
}

// Обновление истории кредитов
function updateCreditHistory() {
    const tbody = document.querySelector('#creditHistory tbody');
    tbody.innerHTML = '';
    const credits = JSON.parse(localStorage.getItem('credits')) || [];

    credits.forEach((credit, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="showPaymentSchedule(${index})">${credit.name}</a></td>
            <td>${credit.remainingMonths}</td>
            <td>${credit.remainingAmount.toFixed(2)}</td>
            <td><button onclick="deleteCredit(${index})">Удалить</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Отображение графика платежей
function showPaymentSchedule(index) {
    const credits = JSON.parse(localStorage.getItem('credits')) || [];
    const credit = credits[index];

    document.getElementById('selectedCreditName').textContent = `График платежей для кредита: ${credit.name}`;
    const tbody = document.querySelector('#paymentSchedule tbody');
    tbody.innerHTML = '';

    credit.payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.month}</td>
            <td>${payment.payment}</td>
            <td><button onclick="markAsPaid(${index}, ${credit.payments.indexOf(payment)})">${payment.status}</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('paymentDetails').style.display = 'block';
}

// Отметка платежа как оплаченного
function markAsPaid(creditIndex, paymentIndex) {
    const credits = JSON.parse(localStorage.getItem('credits')) || [];
    const credit = credits[creditIndex];

    if (credit.payments[paymentIndex].status === 'Не оплачен') {
        credit.payments[paymentIndex].status = 'Оплачен';
        credit.remainingMonths -= 1;
        if (credit.type !== 'lombard') {
            credit.remainingAmount -= parseFloat(credit.payments[paymentIndex].payment);
        }
        localStorage.setItem('credits', JSON.stringify(credits));
        showPaymentSchedule(creditIndex);
        updateCreditHistory();
    }
}

// Удаление кредита
function deleteCredit(index) {
    let credits = JSON.parse(localStorage.getItem('credits')) || [];
    credits.splice(index, 1);
    localStorage.setItem('credits', JSON.stringify(credits));
    updateCreditHistory();
    document.getElementById('paymentDetails').style.display = 'none';
}

// Экспорт данных в CSV
function exportToExcel() {
    const credits = JSON.parse(localStorage.getItem('credits')) || [];
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Добавляем BOM для корректного отображения кириллицы
    csvContent += "Название,Дата,Срок,Тип,Процент,Сумма,Остаток месяцев,Остаток суммы\n";
    credits.forEach(credit => {
        csvContent += `${credit.name},${credit.date},${credit.term},${credit.type},${credit.rate},${credit.amount},${credit.remainingMonths},${credit.remainingAmount.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "credits_export.csv");
    document.body.appendChild(link);
    link.click();
}

// Функции для ручного управления общей суммой
// Получаем элементы DOM
        const numberInput = document.getElementById('numberInput');
        const savedValue = document.getElementById('savedValue');

        // Проверяем, есть ли сохраненное значение в localStorage
        const storedValue = localStorage.getItem('savedNumber');
        if (storedValue) {
            savedValue.textContent = storedValue;
            numberInput.value = storedValue;
        }

        // Добавляем обработчик события на изменение значения в поле ввода
        numberInput.addEventListener('input', function() {
            const value = numberInput.value;
            savedValue.textContent = value;
            localStorage.setItem('savedNumber', value);
        });
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCreditHistory();
    updateTotalPaymentDisplay();
});
