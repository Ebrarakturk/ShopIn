let currentRole = "";
let cart = []; 

// Başlangıç Veritabanı (Eğer sistemde hiç ürün yoksa bunlar yüklenir)
const initialProducts = [
    { id: 1, title: "Akıllı Saat v2", price: 2499, category: "Elektronik", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=300&auto=format&fit=crop", stock: 12, desc: "Gelişmiş adım sayar.", specs: "Su Geçirmez" },
    { id: 2, title: "Kablosuz Kulaklık", price: 899, category: "Elektronik", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop", stock: 8, desc: "ANC özellikli.", specs: "20 saat pil" },
    { id: 9, title: "Klasik Deri Ceket", price: 1850, category: "Giyim", img: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=300&auto=format&fit=crop", stock: 5, desc: "Hakiki deri.", specs: "Beden: L" },
    { id: 10, title: "Basic Beyaz Tişört", price: 250, category: "Giyim", img: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=300&auto=format&fit=crop", stock: 50, desc: "%100 Pamuk.", specs: "Beden: M" },
    { id: 17, title: "Dünya Klasikleri Seti", price: 350, category: "Kitap", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300&auto=format&fit=crop", stock: 20, desc: "5 klasik roman.", specs: "Ciltli" },
    { id: 23, title: "Filtre Kahve Makinesi", price: 1100, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1595434091143-b375ace5d541?q=80&w=300&auto=format&fit=crop", stock: 9, desc: "Zamanlayıcılı.", specs: "12 Fincan" }
];

let products = JSON.parse(localStorage.getItem("shopin_products"));
if (!products || products.length === 0) {
    products = initialProducts;
    localStorage.setItem("shopin_products", JSON.stringify(products));
}

function saveProducts() {
    localStorage.setItem("shopin_products", JSON.stringify(products));
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active-screen'));
    document.getElementById(screenId).classList.add('active-screen');
}

function showAuth(role) {
    currentRole = role;
    document.getElementById('auth-title').innerText = role === 'admin' ? "Yönetici Paneli" : "Kullanıcı Paneli";
    showScreen('screen-auth');
}

// --- GİRİŞ VE KAYIT SİSTEMİ ---
function register() {
    if (currentRole === 'admin') return alert("⛔ Sistem Uyarısı: Yeni yönetici hesabı oluşturulamaz!");
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (!user || !pass) return alert("Kullanıcı adı ve şifre boş bırakılamaz!");

    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    if (db.find(u => u.username === user.toLowerCase())) return alert(`HATA: '${user}' zaten mevcut!`);
    
    db.push({ username: user.toLowerCase(), password: pass, role: currentRole });
    localStorage.setItem("shopin_db", JSON.stringify(db));
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
}

function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    // Yönetici Sabit Girişi
    if (currentRole === 'admin') {
        if (user === "admin" && pass === "shopin123") {
            localStorage.setItem("active_user", "Sistem Yöneticisi");
            alert("Hoş geldin Patron! Yönetici paneline yönlendiriliyorsunuz.");
            showAccountScreen(); 
            return; 
        } else {
            return alert("⛔ Hatalı yönetici giriş denemesi.");
        }
    }

    // Normal Kullanıcı Girişi
    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    const foundUser = db.find(u => u.username === user.toLowerCase() && u.password === pass && u.role === currentRole);

    if (foundUser) {
        localStorage.setItem("active_user", foundUser.username);
        document.getElementById('account-title').innerText = `👤 ${foundUser.username.toUpperCase()} - Hesap Detayları`;
        showScreen('screen-store'); renderProducts(); 
    } else {
        alert("Hatalı kullanıcı adı, şifre veya rol seçimi!");
    }
}

function logout() {
    localStorage.removeItem("active_user");
    cart = []; updateCartBtn();
    document.getElementById('username').value = ""; document.getElementById('password').value = "";
    showScreen('screen-role');
}

// --- FAVORİLER SİSTEMİ ---
function getFavorites() {
    const currentUser = localStorage.getItem("active_user");
    return JSON.parse(localStorage.getItem(`favs_${currentUser}`)) || [];
}

function toggleFavorite(id) {
    const currentUser = localStorage.getItem("active_user");
    if (!currentUser || currentUser === "Sistem Yöneticisi") return;

    let favs = getFavorites();
    const index = favs.indexOf(id);
    if (index === -1) favs.push(id); else favs.splice(index, 1);
    
    localStorage.setItem(`favs_${currentUser}`, JSON.stringify(favs));
    renderProducts(); 
    if (document.getElementById('screen-favorites').classList.contains('active-screen')) showFavorites();
}

function showFavorites() {
    const favs = getFavorites();
    const grid = document.getElementById('favorites-grid');
    grid.innerHTML = "";
    if (favs.length === 0) {
        grid.innerHTML = "<p style='color: #666; font-size: 16px; width:100%;'>Henüz favorilere eklediğiniz bir ürün bulunmamaktadır.</p>";
    } else {
        const favProducts = products.filter(p => favs.includes(p.id));
        favProducts.forEach(p => {
            grid.innerHTML += `
                <div class="product-card">
                    <div class="heart-icon" onclick="toggleFavorite(${p.id})">❤️</div>
                    <img src="${p.img}" class="product-img" onclick="showProductDetail(${p.id})">
                    <h3 style="margin:5px 0; font-size:16px; font-weight:600;">${p.title}</h3>
                    <p style="font-weight:800; font-size:18px;">${p.price} TL</p>
                    <button class="btn btn-outline" style="width:100%; margin:0 0 8px 0;" onclick="showProductDetail(${p.id})">Detay İncele</button>
                    <button class="btn" style="width:100%; margin:0;" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>Sepete Ekle</button>
                </div>`;
        });
    }
    showScreen('screen-favorites');
}

// --- VİTRİN VE ÜRÜNLER ---
function renderProducts(list = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = ""; 
    if (list.length === 0) return grid.innerHTML = "<h3 style='width:100%;'>Aradığınız kriterde ürün bulunamadı.</h3>";

    const currentFavs = getFavorites();

    list.forEach(p => {
        const isFav = currentFavs.includes(p.id);
        const heartSymbol = isFav ? "❤️" : "🤍";

        grid.innerHTML += `
            <div class="product-card">
                <div class="heart-icon" onclick="toggleFavorite(${p.id})">${heartSymbol}</div>
                <img src="${p.img}" alt="${p.title}" class="product-img" onclick="showProductDetail(${p.id})">
                <h3 style="margin:5px 0; font-size:16px; font-weight:600;">${p.title}</h3>
                <p style="font-weight:800; font-size:18px; margin: 5px 0;">${p.price} TL</p>
                <p style="font-size:12px; font-weight:600; color:${p.stock > 0 ? '#49cc90' : '#ff4757'}; margin-bottom: 15px;">Stok: ${p.stock}</p>
                <button class="btn btn-outline" style="width:100%; margin:0 0 8px 0;" onclick="showProductDetail(${p.id})">Detay İncele</button>
                <button class="btn" style="width:100%; margin:0;" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>Sepete Ekle</button>
            </div>
        `;
    });
}

function filterProducts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const filtered = products.filter(p => p.title.toLowerCase().includes(searchText) && (category === "all" || p.category === category));
    renderProducts(filtered);
}

function showProductDetail(id) {
    const p = products.find(prod => prod.id === id);
    document.getElementById('product-detail-content').innerHTML = `
        <img src="${p.img}" style="width:100%; height:300px; object-fit:contain; border-radius:8px; margin-bottom:20px;">
        <h2 style="margin:0 0 10px 0;">${p.title}</h2>
        <p style="font-weight:900; font-size:28px; margin: 0 0 20px 0;">${p.price} TL</p>
        <p style="color: #666; margin-bottom: 5px;"><strong>Kategori:</strong> ${p.category}</p>
        <p style="color: #666; margin-bottom: 5px;"><strong>Açıklama:</strong> ${p.desc}</p>
        <p style="color: #666; margin-bottom: 20px;"><strong>Özellikler:</strong> ${p.specs}</p>
        <p style="color: ${p.stock > 0 ? '#49cc90' : '#ff4757'}; font-weight: 700; font-size: 16px; margin-bottom: 20px;">${p.stock > 0 ? `Stokta var (${p.stock} adet)` : '❌ Tükendi!'}</p>
        <button class="btn" style="width:100%; font-size: 18px; padding: 15px;" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>🛒 Sepete Ekle</button>
    `;
    showScreen('screen-product-detail');
}

// --- SEPET VE SİPARİŞ ONAYI ---
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    if (cart.filter(item => item.id === id).length >= p.stock) return alert(`Hata: Stokta sadece ${p.stock} adet var.`);
    cart.push(p); updateCartBtn(); alert("Ürün sepete eklendi!");
}

function showCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; color: #666;'>Sepetiniz şu an boş.</p>";
        document.getElementById('cart-total').innerText = "Toplam: 0 TL";
        showScreen('screen-cart'); return;
    }
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <div style="display:flex; align-items:center;"><img src="${item.img}" class="cart-item-img"><strong style="font-size: 15px;">${item.title}</strong></div>
                <div style="display:flex; align-items:center;"><span style="font-weight:800; margin-right:20px;">${item.price} TL</span><button class="btn btn-outline" style="margin:0; padding:5px 15px; border-color: #ff4757; color: #ff4757;" onclick="removeFromCart(${index})">Sil</button></div>
            </div>`;
    });
    document.getElementById('cart-total').innerText = `Toplam: ${total} TL`;
    showScreen('screen-cart');
}

function removeFromCart(index) { cart.splice(index, 1); updateCartBtn(); showCart(); }
function updateCartBtn() { document.getElementById('cart-btn').innerText = `🛒 Sepet (${cart.length})`; }

function checkout() {
    if (cart.length === 0) return alert("Sepetiniz boş!");

    const currentUser = localStorage.getItem("active_user");
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    const orderId = Date.now();
    const newOrder = { 
        id: orderId, username: currentUser, date: new Date().toLocaleString('tr-TR'), 
        items: [...cart], total: totalAmount, status: "Sipariş Alındı" 
    };

    let userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser}`)) || [];
    userOrders.push(newOrder);
    localStorage.setItem(`orders_${currentUser}`, JSON.stringify(userOrders));

    let allGlobalOrders = JSON.parse(localStorage.getItem("shopin_all_orders")) || [];
    allGlobalOrders.push(newOrder);
    localStorage.setItem("shopin_all_orders", JSON.stringify(allGlobalOrders));

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product && product.stock > 0) product.stock -= 1;
    });
    saveProducts();

    alert("Sipariş başarıyla alındı! Geçmiş siparişlerinizi 'Hesabım' bölümünden görebilirsiniz.");
    cart = []; updateCartBtn(); showScreen('screen-store'); renderProducts(); 
}

// --- MÜŞTERİ HESABI VE ADMİN PANELİ ---
function showAccountScreen() {
    const currentUser = localStorage.getItem("active_user");

    if (currentUser === "Sistem Yöneticisi") {
        renderAdminPanel();
        showScreen('screen-admin');
    } else {
        const container = document.getElementById('order-history-list');
        container.innerHTML = ""; 
        let userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser}`)) || [];
        
        if (userOrders.length === 0) {
            container.innerHTML = "<p style='color: #666;'>Henüz geçmiş siparişiniz bulunmamaktadır.</p>";
        } else {
            [...userOrders].reverse().forEach((order) => {
                let itemsHtml = order.items.map(item => `<li style="margin-bottom:5px; font-size: 14px;">${item.title}</li>`).join('');
                let statusColor = order.status === "Teslim Edildi" ? "#49cc90" : (order.status === "İptal Edildi" ? "#ff4757" : "#f1c40f");

                container.innerHTML += `
                    <div style="border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px; text-align: left; background: #fafafa;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px;">
                            <div>
                                <span style="font-weight: 600; color: #666; font-size: 14px;">${order.date}</span><br>
                                <span style="display: inline-block; background: ${statusColor}; color: ${statusColor === '#f1c40f' ? '#000' : '#fff'}; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 5px;">${order.status}</span>
                            </div>
                            <span style="font-weight: 900; font-size: 18px;">${order.total} TL</span>
                        </div>
                        <ul style="margin: 0; padding-left: 15px; color: #555;">${itemsHtml}</ul>
                    </div>
                `;
            });
        }
        showScreen('screen-account');
    }
}

function renderAdminPanel() {
    const ordersContainer = document.getElementById('admin-orders-list');
    let allGlobalOrders = JSON.parse(localStorage.getItem("shopin_all_orders")) || [];
    ordersContainer.innerHTML = "";

    if (allGlobalOrders.length === 0) {
        ordersContainer.innerHTML = "<p>Sistemde sipariş yok.</p>";
    } else {
        [...allGlobalOrders].reverse().forEach((order) => {
            const statuses = ["Sipariş Alındı", "Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi", "İptal Edildi"];
            let selectOptions = statuses.map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`).join('');

            ordersContainer.innerHTML += `
                <div class="admin-list-item" style="background: #fafafa; border-radius: 8px; margin-bottom: 10px;">
                    <div><strong style="color:#ff4757;">👤 ${order.username}</strong> | 🛒 ${order.total} TL <br><span style="font-size: 12px; color: gray;">Tarih: ${order.date}</span></div>
                    <div><span style="font-size: 14px; font-weight: bold; margin-right: 10px;">Durum Güncelle:</span>
                        <select onchange="updateOrderStatus(${order.id}, '${order.username}', this.value)" style="padding: 5px; font-weight: bold;">${selectOptions}</select>
                    </div>
                </div>
            `;
        });
    }

    const productsContainer = document.getElementById('admin-products-list');
    productsContainer.innerHTML = "";
    products.forEach(p => {
        productsContainer.innerHTML += `
            <div class="admin-list-item">
                <div style="display:flex; align-items:center;">
                    <img src="${p.img}" style="width:40px; height:40px; object-fit:contain; margin-right: 15px; border: 1px solid #eee;">
                    <strong style="width: 150px;">${p.title}</strong><span style="color: gray; font-size: 14px;">${p.price} TL</span>
                </div>
                <div style="display:flex; align-items:center;">
                    Stok: <input type="number" id="stock-input-${p.id}" value="${p.stock}" style="width: 50px; padding: 5px; margin: 0 10px;">
                    <button class="btn btn-outline" style="padding: 5px 10px; margin: 0 5px;" onclick="updateProductStock(${p.id})">💾</button>
                    <button class="btn" style="padding: 5px 10px; margin: 0; background: #ff4757; border-color: #ff4757;" onclick="deleteProduct(${p.id})">🗑️</button>
                </div>
            </div>
        `;
    });
}

function updateOrderStatus(orderId, username, newStatus) {
    let allGlobalOrders = JSON.parse(localStorage.getItem("shopin_all_orders")) || [];
    let orderIndex = allGlobalOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) allGlobalOrders[orderIndex].status = newStatus;
    localStorage.setItem("shopin_all_orders", JSON.stringify(allGlobalOrders));

    let userOrders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
    let userOrderIndex = userOrders.findIndex(o => o.id === orderId);
    if (userOrderIndex !== -1) userOrders[userOrderIndex].status = newStatus;
    localStorage.setItem(`orders_${username}`, JSON.stringify(userOrders));

    alert(`Sipariş durumu "${newStatus}" olarak güncellendi!`);
}

function addNewProduct() {
    const title = document.getElementById('add-title').value.trim();
    const price = parseFloat(document.getElementById('add-price').value);
    const category = document.getElementById('add-category').value;
    const stock = parseInt(document.getElementById('add-stock').value);
    const img = document.getElementById('add-img').value.trim() || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop"; 

    if (!title || isNaN(price) || isNaN(stock)) return alert("Lütfen Ürün Adı, Fiyat ve Stok bilgilerini eksiksiz girin!");

    const newProduct = { id: Date.now(), title, price, category, stock, img, desc: "Yönetici tarafından yeni eklendi.", specs: "Standart Ürün" };
    products.unshift(newProduct); saveProducts();
    
    document.getElementById('add-title').value = ""; document.getElementById('add-price').value = "";
    document.getElementById('add-stock').value = ""; document.getElementById('add-img').value = "";

    alert(`${title} başarıyla eklendi!`); renderAdminPanel(); renderProducts(); 
}

function updateProductStock(id) {
    const newStock = parseInt(document.getElementById(`stock-input-${id}`).value);
    if (isNaN(newStock) || newStock < 0) return alert("Geçerli bir stok sayısı girin!");
    const product = products.find(p => p.id === id);
    if (product) { product.stock = newStock; saveProducts(); alert(`${product.title} stoğu güncellendi!`); renderProducts(); }
}

function deleteProduct(id) {
    if (!confirm("Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?")) return;
    products = products.filter(p => p.id !== id); saveProducts();
    alert("Ürün başarıyla silindi."); renderAdminPanel(); renderProducts(); 
}