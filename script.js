// E-commerce Store JavaScript

// Global variables
let products = [];
let cart = [];
let whatsappNumber = "+1234567890"; // Default number - change this to your WhatsApp

// Initialize with sample products

function initializeStore() {
 

    products = JSON.parse(localStorage.getItem('storeProducts')) || [];
    whatsappNumber = localStorage.getItem('whatsappNumber') || "+1234567890";
    
    document.getElementById('whatsappNumber').value = whatsappNumber;
    displayProducts();
    updateCartCount();
}

// Admin functions
const ADMIN_PASSWORD = "PUNCKROCK";

function toggleAdmin() {
    const form = document.getElementById('adminForm');

    if (!form.classList.contains('active')) {
        // Ask for password before opening
        const enteredPassword = prompt("🔒 Enter admin password:");
        if (enteredPassword === ADMIN_PASSWORD) {
            form.classList.add('active');
        } else {
            alert("❌ Wrong password!");
        }
    } else {
        // Close if already open
        form.classList.remove('active');
    }
}
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').value;

    if (!name || !price || !description) {
        alert('⚠️ Please fill in all required fields');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        description,
        image: image || '📦'
    };

    products.push(newProduct);
    localStorage.setItem('storeProducts', JSON.stringify(products));
    
    // Clear form
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImage').value = '';
    
    displayProducts();
    alert('✅ Product added successfully!');
}

function deleteProduct(id) {
    if (confirm('❓ Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('storeProducts', JSON.stringify(products));
        displayProducts();
    }
}

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <button class="delete-product-btn" onclick="deleteProduct(${product.id})" title="Delete Product">×</button>
            <div class="product-image">
                ${product.image.startsWith('http') ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : product.image}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        
        // Visual feedback
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Added!';
        btn.style.background = '#2ed573';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 1000);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            displayCart();
            updateCartCount();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function openCart() {
    displayCart();
    document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('successMessage').classList.remove('active');
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutForm = document.getElementById('checkoutForm');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">🛒 Your cart is empty</p>';
        cartTotal.textContent = 'Total: ₹0.00';
        checkoutForm.style.display = 'none';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <div style="font-weight: 600;">${item.name}</div>
                <div style="color: #666; font-size: 0.9rem;">₹${item.price.toFixed(2)} each</div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: #ff4757; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: #2ed573; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                </div>
                <div style="font-weight: 600; color: #667eea;">₹${itemTotal.toFixed(2)}</div>
                <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 5px; cursor: pointer;" title="Remove item">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
    checkoutForm.style.display = 'grid';
}

// Checkout function
function placeOrder() {
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    if (!name || !email || !phone || !address) {
        alert('⚠️ Please fill in all customer information');
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generate receipt
    let receipt = `🧾 *NEW ORDER RECEIVED*\n\n`;
    receipt += `👤 *Customer Information:*\n`;
    receipt += `Name: ${name}\n`;
    receipt += `Email: ${email}\n`;
    receipt += `Phone: ${phone}\n`;
    receipt += `Address: ${address}\n\n`;
    receipt += `🛒 *Order Details:*\n`;
    
    cart.forEach(item => {
        receipt += `• ${item.name}\n`;
        receipt += `  Price: ₹${item.price.toFixed(2)} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    receipt += `\n💰 *Total Amount: ₹${total.toFixed(2)}*\n\n`;
    receipt += `📅 Order Date: ${new Date().toLocaleString()}\n`;
    receipt += `🌐 Ordered from: ${window.location.href}`;

    // Send to WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(receipt)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart and show success
    cart = [];
    updateCartCount();
    
    // Clear form
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    
    // Show success message
    document.getElementById('successMessage').classList.add('active');
    document.getElementById('checkoutForm').style.display = 'none';
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeCart();
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
}

// Initialize store when page loads
window.onload = function() {
    initializeStore();
}
