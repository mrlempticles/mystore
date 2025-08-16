// E-commerce Store JavaScript

// Global variables
let cart = [];
let whatsappNumber = "+919871978700"; // <-- put your WhatsApp number here

// Hard-coded products
let products = [
    {
        id: 1,
        name: "Bamboo Heat-Resistant Coaster Set",
        price: 399,
        description: `Crafted for elegance. Designed for strength. Built for everyday magic. 
        Give your kitchen a premium touch with this laser-engraved, eco-friendly, ultra-slim bamboo coaster set. 
        Heat Resistant up to 250°C, Anti-Slip Rubber Grip, 20cm Extra-Wide Surface, 100% Sustainable Bamboo.`,
        image: "https://images.meesho.com/images/products/560397558/zy2h7_512.avif?width=512"
    },
    {
        id: 2,
        name: "Stainless Steel Multi-Purpose 2 Tier Kitchen Rack",
        price: 399,
        description: `Stainless Steel Multi-Purpose 2 Tier Kitchen Rack | Spice Dabba Rack | Kitchen Organizer | Cosmetic Holder.
        Perfect for organizing pasta, condiments, spices, packets & more. Durable stainless steel build.`,
        image: "https://images.meesho.com/images/products/424679691/zptlr_512.avif?width=512"
    },
    {
        id: 3,
        name: "Golden Spoon Set",
        price: 299,
        description: `Golden Spoon Set – Coffee & Dessert Spoons (Set of 4). 
        Made of stainless steel with elegant gold finish. Perfect for tableware and gifting.`,
        image: "https://images.meesho.com/images/products/554338523/i2p0s_512.avif?width=512"
    },
    {
        id: 4,
        name: "Washing Gloves",
        price: 299,
        description: `Magic Silicone Dish Washing Gloves – multipurpose gloves for kitchen, dishwashing, pet grooming, car wash & more. 
        Durable silicone with anti-slip design.`,
        image: "https://images.meesho.com/images/products/468316392/l3px1_512.avif?width=512"
    }
];

// Initialize Store
function initializeStore() {
    displayProducts();
    updateCartCount();
}

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price}</div>
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
        
        // Button feedback
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
                <div style="color: #666; font-size: 0.9rem;">₹${item.price} each</div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: #ff4757; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: #2ed573; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                </div>
                <div style="font-weight: 600; color: #667eea;">₹${itemTotal}</div>
                <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 5px; cursor: pointer;" title="Remove item">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `Total: ₹${total}`;
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

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let receipt = `🧾 *NEW ORDER RECEIVED*\n\n`;
    receipt += `👤 *Customer Information:*\n`;
    receipt += `Name: ${name}\n`;
    receipt += `Email: ${email}\n`;
    receipt += `Phone: ${phone}\n`;
    receipt += `Address: ${address}\n\n`;
    receipt += `🛒 *Order Details:*\n`;
    
    cart.forEach(item => {
        receipt += `• ${item.name}\n`;
        receipt += `  Price: ₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity)}\n`;
    });
    
    receipt += `\n💰 *Total Amount: ₹${total}*\n\n`;
    receipt += `📅 Order Date: ${new Date().toLocaleString()}\n`;
    receipt += `🌐 Ordered from: ${window.location.href}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(receipt)}`;
    window.open(whatsappUrl, '_blank');

    cart = [];
    updateCartCount();
    
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    
    document.getElementById('successMessage').classList.add('active');
    document.getElementById('checkoutForm').style.display = 'none';
    
    setTimeout(() => {
        closeCart();
    }, 5000);
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
}

// Initialize store
window.onload = function() {
    initializeStore();
}
