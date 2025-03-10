document.addEventListener('DOMContentLoaded', function () {
    // Элементы DOM
    const periodButtons = document.querySelectorAll('#period-buttons button');
    const periodText = document.getElementById('period-text');
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpenseElement = document.getElementById('total-expense');

    // Данные (загружаем из localStorage)
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Инициализация диаграмм
    let expenseChart, incomeChart;

    function initCharts() {
        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        const incomeCtx = document.getElementById('incomeChart').getContext('2d');

        // Диаграмма для расходов
        expenseChart = new Chart(expenseCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Расходы по категориям',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Расходы по категориям'
                    }
                }
            }
        });

        // Диаграмма для доходов
        incomeChart = new Chart(incomeCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Доходы по категориям',
                    data: [],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Доходы по категориям'
                    }
                }
            }
        });
    }

    // Расчет данных для диаграмм
    function calculateTransactionsByCategory(transactions) {
        const expenseCategories = {};
        const incomeCategories = {};

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            const category = transaction.category;
            const amount = parseFloat(transaction.amount);
            const type = transaction.type;

            if (type === 'income') {
                if (!incomeCategories[category]) {
                    incomeCategories[category] = 0;
                }
                incomeCategories[category] += amount;
                totalIncome += amount;
            } else if (type === 'expense') {
                if (!expenseCategories[category]) {
                    expenseCategories[category] = 0;
                }
                expenseCategories[category] += amount;
                totalExpense += amount;
            }
        });

        return {
            expenseLabels: Object.keys(expenseCategories),
            expenseData: Object.values(expenseCategories),
            incomeLabels: Object.keys(incomeCategories),
            incomeData: Object.values(incomeCategories),
            totalIncome,
            totalExpense
        };
    }

    // Обновление диаграмм и общей информации
    function updateCharts(data) {
        // Обновляем диаграммы
        expenseChart.data.labels = data.expenseLabels;
        expenseChart.data.datasets[0].data = data.expenseData;
        expenseChart.update();

        incomeChart.data.labels = data.incomeLabels;
        incomeChart.data.datasets[0].data = data.incomeData;
        incomeChart.update();

        // Обновляем общие суммы
        totalIncomeElement.textContent = data.totalIncome.toFixed(2);
        totalExpenseElement.textContent = data.totalExpense.toFixed(2);
    }

    // Фильтрация транзакций по периоду
    function filterTransactionsByPeriod(transactions, period) {
        const now = new Date();
        let periodTextValue = 'Все время';

        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            switch (period) {
                case 'day':
                    periodTextValue = 'День';
                    return transactionDate.toDateString() === now.toDateString();
                case 'week':
                    periodTextValue = 'Неделя';
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    return transactionDate >= startOfWeek;
                case 'month':
                    periodTextValue = 'Месяц';
                    return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
                case 'year':
                    periodTextValue = 'Год';
                    return transactionDate.getFullYear() === now.getFullYear();
                default:
                    periodTextValue = 'Все время';
                    return true;
            }
        });

        // Обновляем текст периода
        periodText.textContent = periodTextValue;

        return filteredTransactions;
    }

    // Обработка кнопок периода
    periodButtons.forEach(button => {
        button.addEventListener('click', function () {
            const period = this.getAttribute('data-period');
            const filteredTransactions = filterTransactionsByPeriod(transactions, period);
            const chartData = calculateTransactionsByCategory(filteredTransactions);
            updateCharts(chartData);
        });
    });

    // Инициализация
    initCharts();
    const initialData = calculateTransactionsByCategory(transactions);
    updateCharts(initialData);
});
