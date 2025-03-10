class Accounts {
    constructor() {
        this.accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        this.accountSelect = document.getElementById('account');
        this.hiddenAccountSelect = document.getElementById('hidden-account');
        this.accountList = document.getElementById('account-list');
    }

    init() {
        this.updateAccounts();
    }

    addAccount(name, balance, currency) {
        this.accounts.push({ name, balance: formatMoney(balance), currency });
        this.updateAccounts();
        localStorage.setItem('accounts', JSON.stringify(this.accounts));
    }

    deleteAccount(index) {
        this.accounts.splice(index, 1);
        this.updateAccounts();
        localStorage.setItem('accounts', JSON.stringify(this.accounts));
    }

    updateAccounts() {
        this.accountSelect.innerHTML = '';
        this.hiddenAccountSelect.innerHTML = '';
        this.accountList.innerHTML = '';

        this.accounts.forEach((account, index) => {
            const balanceFormatted = formatMoney(account.balance);
            const option = document.createElement('option');
            option.value = account.name;
            option.textContent = `${account.name} (${balanceFormatted} ${account.currency})`;
            this.accountSelect.appendChild(option.cloneNode(true));
            this.hiddenAccountSelect.appendChild(option);

            const li = document.createElement('li');
            li.innerHTML = `
                ${account.name} (${balanceFormatted} ${account.currency})
                <button onclick="deleteAccount(${index})">Удалить</button>
            `;
            this.accountList.appendChild(li);
        });
    }
}
