document.addEventListener('DOMContentLoaded', function() {
    // Agrega un adming user por default si no está presente
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.find(u => u.username === 'admin')) {
        users.push({ username: 'admin', name: 'Admin', password: 'admin123', email: 'admin@example.com', phone: '0000000000', role: 'admin' });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Verifica el Login status y actualiza el usuario
    const authLink = document.getElementById('auth-link');
    const userInfo = document.getElementById('user-info');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        authLink.innerHTML = '<a class="nav-link" href="#" id="logout-link">Logout</a>';
        userInfo.innerHTML = `<a class="nav-link" href="#"><i class="fas fa-user"></i> ${loggedInUser.name || 'Admin'}</a>`;
    } else {
        authLink.innerHTML = '<a class="nav-link" href="login.html">Login</a>';
        userInfo.innerHTML = '';
    }

    // Manejo de logout
    document.getElementById('logout-link')?.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    // Submit del formulario de registro
    document.getElementById('register-form')?.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;
        const username = document.getElementById('username');
        const name = document.getElementById('name');
        const password = document.getElementById('password');
        const repeatPassword = document.getElementById('repeatPassword');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const terms = document.getElementById('terms');

        // Validacion Nombre Usuario
        if (username.value.trim() === '') {
            username.classList.add('is-invalid');
            isValid = false;
        } else {
            username.classList.remove('is-invalid');
            username.classList.add('is-valid');
        }

        // Validacion Nombre
        if (name.value.trim() === '') {
            name.classList.add('is-invalid');
            isValid = false;
        } else {
            name.classList.remove('is-invalid');
            name.classList.add('is-valid');
        }

        // Validacion contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/;
        if (!passwordRegex.test(password.value)) {
            password.classList.add('is-invalid');
            isValid = false;
        } else {
            password.classList.remove('is-invalid');
            password.classList.add('is-valid');
        }

        // Validacion repeticion de constraseñas
        if (repeatPassword.value !== password.value) {
            repeatPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            repeatPassword.classList.remove('is-invalid');
            repeatPassword.classList.add('is-valid');
        }

        // Validacion correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }

        // Validacion Telefono
         // regex numeros chilenos
        const phoneRegex = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
        if (!phoneRegex.test(phone.value)) {
            phone.classList.add('is-invalid');
            isValid = false;
        } else {
            phone.classList.remove('is-invalid');
            phone.classList.add('is-valid');
        }

        // Validacion de Terminos
        if (!terms.checked) {
            terms.classList.add('is-invalid');
            isValid = false;
        } else {
            terms.classList.remove('is-invalid');
            terms.classList.add('is-valid');
        }

        if (isValid) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ username: username.value, name: name.value, password: password.value, email: email.value, phone: phone.value, role: 'user' });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registro Exitoso');
            window.location.href = 'login.html';
        }
    });

    // Submit formulario de Login
    document.getElementById('login-form')?.addEventListener('submit', function(event) {
        event.preventDefault();
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Ha iniciado sesión');
            if (user.username === 'admin' && user.password === 'admin123') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert('Usuario o Contraseña Invalida');
        }
    });

    // Recuperar Contraseña
    document.getElementById('recover-form')?.addEventListener('submit', function(event) {
        event.preventDefault();
        let email = document.getElementById('recover-email').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.email === email);

        if (user) {
            alert('Las instruciones para recuperar la contraseña han sido enviadas a su correo.');
            // En una app real, aquí enviariamos el correo.
            // Por ahora, sólo simulamos la acción
            $('#recoverModal').modal('hide');
        } else {
            alert('El correo ingresado no se ha encontrado o no es válido.');
        }
    });

    // Actualiza el counter del carro y total en la pagina cargada
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount(cart);
    updateCartTotal(cart);
    updateCartItems(cart);

    // Boton agregar
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            let product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.closest('.card').querySelector('img').src // Get the image URL
            };
            addToCart(product);
        });
    });

    // Vaciar Carro
    document.getElementById('empty-cart')?.addEventListener('click', function() {
        emptyCart();
    });

    // Boton Pagar
    document.getElementById('pay')?.addEventListener('click', function() {
        alert('Su pago ha sido procesado correctamente');
        emptyCart();
        window.location.href = 'index.html';
    });

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(cart);
        updateCartTotal(cart);
        updateCartItems(cart);
    }

    function updateCartCount(cart) {
        document.getElementById('cart-count').innerText = cart.length;
    }

    function updateCartTotal(cart) {
        let total = cart.reduce((sum, product) => sum + product.price, 0);
        if (total === 0) {
            document.getElementById('cart-total').innerText = '$0';
        } else {
            document.getElementById('cart-total').innerText = '$' + total.toFixed(3);
        }

        // Actualiza el total en el cart.html
        let cartTotalInCartPage = document.getElementById('cart-total-in-cart-page');
        if (cartTotalInCartPage) {
            if (total === 0) {
                cartTotalInCartPage.innerText = '$0';
            } else {
                cartTotalInCartPage.innerText = '$' + total.toFixed(3);
            }
        }
    }

    function updateCartItems(cart) {
        let cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = '';
            cart.forEach((product, index) => {
                let listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    ${product.name} - $${product.price.toFixed(3)}
                    <button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">Eliminar</button>
                `;
                cartItems.appendChild(listItem);
            });

            // Agrega los listener para los botones de eliminar
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', function() {
                    let productIndex = this.getAttribute('data-index');
                    removeFromCart(productIndex);
                });
            });
        }

        let cartTotalItems = document.getElementById('cart-total-items');
        if (cartTotalItems) {
            cartTotalItems.innerText = cart.length;
        }
    }

    function removeFromCart(productIndex) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(cart);
        updateCartTotal(cart);
        updateCartItems(cart);
    }

    function emptyCart() {
        localStorage.removeItem('cart');
        let cart = [];
        updateCartCount(cart);
        updateCartTotal(cart);
        updateCartItems(cart);
    }
});
