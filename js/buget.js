// Получаем элементы
const budgetInput = document.getElementById('budget');
const percentInputs = document.querySelectorAll('.percent');
const amountInputs = document.querySelectorAll('.amount');
const commentInputs = document.querySelectorAll('.comment');
const remainingPercent = document.getElementById('remainingPercent');

// Загрузка данных из localStorage
function loadData() {
    const savedData = JSON.parse(localStorage.getItem('budgetData')) || {};

    if (savedData.budget) {
        budgetInput.value = savedData.budget;
    }

    percentInputs.forEach((input, index) => {
        if (savedData.percent && savedData.percent[index]) {
            input.value = savedData.percent[index];
        }
    });

    commentInputs.forEach((input, index) => {
        if (savedData.comments && savedData.comments[index]) {
            input.value = savedData.comments[index];
        }
    });

    updateBudget(); // Обновляем расчеты после загрузки данных
}

// Сохранение данных в localStorage
function saveData() {
    const data = {
        budget: budgetInput.value,
        percent: [],
        comments: []
    };

    percentInputs.forEach(input => data.percent.push(input.value));
    commentInputs.forEach(input => data.comments.push(input.value));

    localStorage.setItem('budgetData', JSON.stringify(data));
}

// Функция для обновления сумм и остатка процентов
function updateBudget() {
    const budget = parseFloat(budgetInput.value) || 0;
    let totalPercent = 0;

    percentInputs.forEach((percentInput, index) => {
        const percent = parseFloat(percentInput.value) || 0;
        totalPercent += percent;

        // Если сумма процентов превышает 100, сбрасываем ввод
        if (totalPercent > 100) {
            percentInput.value = '';
            totalPercent -= percent;
            alert("Сумма процентов не может превышать 100%!");
        }

        const amount = (budget * percent) / 100;
        amountInputs[index].value = amount.toFixed(2);
    });

    remainingPercent.textContent = (100 - totalPercent).toFixed(2);
    saveData(); // Сохраняем данные после каждого изменения
}

// Слушаем изменения в процентах и бюджете
percentInputs.forEach(input => input.addEventListener('input', updateBudget));
budgetInput.addEventListener('input', updateBudget);
commentInputs.forEach(input => input.addEventListener('input', saveData));

// Функция для сброса
function resetBudget() {
    if (confirm("Вы уверены, что хотите сбросить все данные?")) {
        budgetInput.value = '';
        percentInputs.forEach(input => input.value = '');
        amountInputs.forEach(input => input.value = '');
        commentInputs.forEach(input => input.value = '');
        remainingPercent.textContent = '100';
        localStorage.removeItem('budgetData'); // Удаляем сохраненные данные
    }
}

// Загружаем данные при загрузке страницы
window.addEventListener('load', loadData);
