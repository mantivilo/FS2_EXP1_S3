document.addEventListener('DOMContentLoaded', function() {
    // Agrega un usuario admin por default en caso de no estar presente.
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.find(u => u.username === 'admin')) {
        users.push({ username: 'admin', name: 'Admin', password: 'admin123', email: 'admin@example.com', phone: '0000000000', role: 'admin' });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Verifica Login status y actualiza el auth link
    const authLink = document.getElementById('auth-link');
    const userInfo = document.getElementById('user-info');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        authLink.innerHTML = '<a class="nav-link" href="#" id="logout-link">Logout</a>';
        userInfo.innerHTML = `<a class="nav-link" href="#"><i class="fas fa-user"></i> ${loggedInUser.name}</a>`;
    } else {
        authLink.innerHTML = '<a class="nav-link" href="login.html">Login</a>';
        userInfo.innerHTML = '';
    }

    // Manejo de logout
    document.getElementById('logout-link')?.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    // Register form submission
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

        // Username validation
        if (username.value.trim() === '') {
            username.classList.add('is-invalid');
            isValid = false;
        } else {
            username.classList.remove('is-invalid');
            username.classList.add('is-valid');
        }

        // Name validation
        if (name.value.trim() === '') {
            name.classList.add('is-invalid');
            isValid = false;
        } else {
            name.classList.remove('is-invalid');
            name.classList.add('is-valid');
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/;
        if (!passwordRegex.test(password.value)) {
            password.classList.add('is-invalid');
            isValid = false;
        } else {
            password.classList.remove('is-invalid');
            password.classList.add('is-valid');
        }

        // Repeat Password validation
        if (repeatPassword.value !== password.value) {
            repeatPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            repeatPassword.classList.remove('is-invalid');
            repeatPassword.classList.add('is-valid');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.value)) {
            phone.classList.add('is-invalid');
            isValid = false;
        } else {
            phone.classList.remove('is-invalid');
            phone.classList.add('is-valid');
        }

        // Terms validation
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
            alert('Registration successful');
            window.location.href = 'login.html';
        }
    });

    // Submit para el Formulario Login
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
            alert('Las instruciones pare recuperar la contraseña han sifo enviadas a su correo.');
            // En una app real, aquí enviariamos el correo.
            // Por ahora, sólo simulamos la acción
            $('#recoverModal').modal('hide');
        } else {
            alert('El correo ingresado no se ha encontrado o no es válido.');
        }
    });

     // Update cart count and total on page load
     let cart = JSON.parse(localStorage.getItem('cart')) || [];
     updateCartCount(cart);
     updateCartTotal(cart);
     updateCartItems(cart);
 
     // Add to cart button click
     document.querySelectorAll('.add-to-cart').forEach(button => {
         button.addEventListener('click', function() {
             let product = {
                 id: this.getAttribute('data-id'),
                 name: this.getAttribute('data-name'),
                 price: parseFloat(this.getAttribute('data-price'))
             };
             addToCart(product);
         });
     });
 
     // Empty Cart button click
     document.getElementById('empty-cart')?.addEventListener('click', function() {
         emptyCart();
     });
 
     // Pay button click
     document.getElementById('pay')?.addEventListener('click', function() {
         alert('Paid successfully');
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
 
         // Update total in cart.html if present
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
                     ${product.name} - $${product.price.toFixed(3)}
                     <button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">Remove</button>
                 `;
                 cartItems.appendChild(listItem);
             });
 
             // Add event listener for remove buttons
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
