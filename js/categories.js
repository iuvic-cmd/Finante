class Categories {
    constructor() {
        this.categories = JSON.parse(localStorage.getItem('categories')) || [];
        this.categorySelect = document.getElementById('category');
        this.categoryList = document.getElementById('category-list');
    }

    init() {
        this.updateCategories();
    }

    addCategory(name) {
        this.categories.push({ name });
        this.updateCategories();
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    deleteCategory(index) {
        this.categories.splice(index, 1);
        this.updateCategories();
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    updateCategories() {
        this.categorySelect.innerHTML = '';
        this.categoryList.innerHTML = '';

        this.categories.forEach((category, index) => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            this.categorySelect.appendChild(option);

            const li = document.createElement('li');
            li.innerHTML = `
                ${category.name}
                <button onclick="deleteCategory(${index})">Удалить</button>
            `;
            this.categoryList.appendChild(li);
        });
    }
}
