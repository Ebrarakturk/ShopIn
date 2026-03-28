// --- 1. SİSTEM DEĞİŞKENLERİ ---
let currentRole = "";
let cart = []; 

// Ürün Veritabanı (Stok, Açıklama ve Özellikler Eklendi)
const products = [
    { id: 1, title: "Akıllı Saat v2", price: 2499, category: "Elektronik", img: "⌚", stock: 12, desc: "Gelişmiş adım sayar ve kalp ritmi ölçer.", specs: "Bluetooth 5.0, Su Geçirmez" },
    { id: 2, title: "Klasik Deri Ceket", price: 1850, category: "Giyim", img: "🧥", stock: 5, desc: "Hakiki deri, kış aylarının vazgeçilmezi.", specs: "Beden: L, Renk: Siyah" },
    { id: 3, title: "Kablosuz Kulaklık", price: 899, category: "Elektronik", img: "🎧", stock: 8, desc: "Gürültü engelleyici (ANC) özellikli.", specs: "20 saat pil ömrü, Mikrofonlu" },
    { id: 4, title: "Roman Seti", price: 350, category: "Kitap", img: "📚", stock: 20, desc: "Dünya klasikleri 5'li set.", specs: "Ciltli, 1500 sayfa" }
];

// --- 2. EKRAN MOTORU ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active-screen'));
    document.getElementById(screenId).classList.add('active-screen');
}

function showAuth(role) {
    currentRole = role;
    document.getElementById('auth-title').innerText = role === 'admin' ? "Yönetici Paneli" : "Kullanıcı Paneli";
    showScreen('screen-auth');
}

// --- 3. GİRİŞ VE KAYIT ---
function register() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (!user || !pass) return alert("Kullanıcı adı ve şifre boş bırakılamaz!");

    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    if (db.find(u => u.username === user.toLowerCase())) {
        return alert(`HATA: '${user}' isimli hesap zaten mevcut! Lütfen giriş yapın.`);
    }

    db.push({ username: user.toLowerCase(), password: pass, role: currentRole });
    localStorage.setItem("shopin_db", JSON.stringify(db));
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
}

function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    
    const foundUser = db.find(u => u.username === user.toLowerCase() && u.password === pass && u.role === currentRole);

    if (foundUser) {
        localStorage.setItem("active_user", foundUser.username);
        document.getElementById('account-title').innerText = `👤 ${foundUser.username} - Hesap Detayları`;
        alert(`Hoş geldin ${foundUser.username}!`);
        showScreen('screen-store'); 
        renderProducts(); 
    } else {
        alert("Hatalı kullanıcı adı, şifre veya rol seçimi!");
    }
}

function logout() {
    localStorage.removeItem("active_user");
    cart = []; 
    updateCartBtn();
    alert("Hesaptan çıkış yapıldı.");
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    showScreen('screen-role');
}

// --- 4. MAĞAZA VE ÜRÜNLER ---
function renderProducts(list = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = ""; 
    if (list.length === 0) return grid.innerHTML = "<h3>Ürün bulunamadı.</h3>";

    list.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-icon" onclick="showProductDetail(${p.id})">${p.img}</div>
                <h3 style="margin:5px 0;">${p.title}</h3>
                <p style="color:#ff4757; font-weight:bold; font-size:18px;">${p.price} TL</p>
                <p style="font-size:12px; font-weight:bold; color:${p.stock > 0 ? 'green' : 'red'};">Stok: ${p.stock}</p>
                <button class="btn" style="width:100%; margin:5px 0; background: #f1c40f; color: black;" onclick="showProductDetail(${p.id})">Detay İncele</button>
                <button class="btn" style="width:100%; margin:0; background:#49cc90;" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>Sepete Ekle</button>
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

// --- 5. ÜRÜN DETAY SAYFASI ---
function showProductDetail(id) {
    const p = products.find(prod => prod.id === id);
    const container = document.getElementById('product-detail-content');
    
    container.innerHTML = `
        <div style="font-size:100px; background:#f8f9fa; padding:20px; border-radius:10px; margin-bottom:15px;">${p.img}</div>
        <h2>${p.title}</h2>
        <p style="color:#ff4757; font-weight:bold; font-size:28px;">${p.price} TL</p>
        <hr>
        <p><strong>Açıklama:</strong> ${p.desc}</p>
        <p><strong>Özellikler:</strong> ${p.specs}</p>
        <p style="color: ${p.stock > 0 ? 'green' : 'red'}; font-weight: bold; font-size: 18px;">
            ${p.stock > 0 ? `Stokta var (${p.stock} adet)` : '❌ Tükendi!'}
        </p>
        <button class="btn" style="width:100%; font-size: 18px; background:#49cc90;" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>🛒 Sepete Ekle</button>
    `;
    showScreen('screen-product-detail');
}

// --- 6. SEPET VE SİPARİŞ ONAYI ---
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    // Stok kontrolü: Sepette stoktan fazla ürün olamaz
    const countInCart = cart.filter(item => item.id === id).length;
    
    if (countInCart >= p.stock) {
        return alert(`Hata: Stokta sadece ${p.stock} adet ${p.title} var. Daha fazla ekleyemezsiniz!`);
    }

    cart.push(p);
    updateCartBtn();
    alert(`${p.title} sepetinize eklendi!`);
}

function showCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; font-size: 18px;'>Sepetiniz şu an boş.</p>";
        totalEl.innerText = "Toplam: 0 TL";
        showScreen('screen-cart');
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <div style="display:flex; align-items:center; gap: 15px;">
                    <span style="font-size:30px;">${item.img}</span>
                    <strong style="font-size: 18px;">${item.title}</strong>
                </div>
                <div>
                    <span style="color:#ff4757; font-weight:bold; margin-right:15px; font-size: 18px;">${item.price} TL</span>
                    <button class="btn" style="background:red; padding:5px 10px; margin:0;" onclick="removeFromCart(${index})">Sil</button>
                </div>
            </div>
        `;
    });
    totalEl.innerText = `Toplam: ${total} TL`;
    showScreen('screen-cart');
}

function removeFromCart(index) {
    cart.splice(index, 1); // Seçili ürünü diziden çıkar
    updateCartBtn();
    showCart(); // Sepeti anında yenile
}

function checkout() {
    if (cart.length === 0) return alert("Sepetiniz boş, sipariş verilemez!");

    // Sipariş onaylandığında alınan ürünlerin stoğunu düşür
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product && product.stock > 0) {
            product.stock -= 1;
        }
    });

    alert("Tebrikler! Siparişiniz başarıyla alındı ve stoklar güncellendi. 🚀");
    cart = []; // Sepeti boşalt
    updateCartBtn();
    showScreen('screen-store');
    renderProducts(); // Ana sayfadaki stok sayılarını güncelle
}

function updateCartBtn() {
    document.getElementById('cart-btn').innerText = `🛒 Sepet (${cart.length})`;
}