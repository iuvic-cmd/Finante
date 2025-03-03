document.getElementById('loginBtn').addEventListener('click', function() {
    let password = document.getElementById('password').value;
    
    if (password === "1234") {  // Замени на свой пароль
        localStorage.setItem("loggedIn", "true");
        window.location.href = "index.html";  // Перенаправление в основное приложение
    } else {
        alert("Неверный пароль!");
    }
});
