// --- 1. SİSTEM DEĞİŞKENLERİ VE YÖNLENDİRME ---
let currentRole = "";
let cart = []; // Kullanıcının sepeti

// Ürün Veritabanı (Simülasyon)
const products = [
    { id: 1, title: "Akıllı Saat v2", price: 2499, category: "Elektronik", img: "⌚" },
    { id: 2, title: "Klasik Deri Ceket", price: 1850, category: "Giyim", img: "🧥" },
    { id: 3, title: "Kablosuz Kulaklık", price: 899, category: "Elektronik", img: "🎧" },
    { id: 4, title: "Roman Seti", price: 350, category: "Kitap", img: "📚" }
];

// Ekran Değiştirme Motoru
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active-screen'));
    document.getElementById(screenId).classList.add('active-screen');
}

function showAuth(role) {
    currentRole = role;
    document.getElementById('auth-title').innerText = role === 'admin' ? "Yönetici Paneli" : "Kullanıcı Paneli";
    showScreen('screen-auth');
}

// --- 2. GİRİŞ VE KAYIT SİSTEMİ ---
function register() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (!user || !pass) return alert("Kullanıcı adı ve şifre boş bırakılamaz!");

    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    
    // Mükerrer Hesap Kontrolü
    const exists = db.find(u => u.username === user.toLowerCase());
    if (exists) {
        alert(`HATA: '${user}' isimli hesap zaten mevcut! Lütfen giriş yapın.`);
        return;
    }

    // Yeni Kullanıcıyı Kaydet
    db.push({ username: user.toLowerCase(), password: pass, role: currentRole });
    localStorage.setItem("shopin_db", JSON.stringify(db));
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
}

function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    
    // Kullanıcı Adı, Şifre ve Rol Kontrolü
    const foundUser = db.find(u => u.username === user.toLowerCase() && u.password === pass && u.role === currentRole);

    if (foundUser) {
        localStorage.setItem("active_user", foundUser.username);
        document.getElementById('account-title').innerText = `👤 ${foundUser.username} - Hesap Detayları`;
        alert(`Hoş geldin ${foundUser.username}!`);
        
        showScreen('screen-store'); // Mağazaya geç
        renderProducts(); // Ürünleri vitrine diz
    } else {
        alert("Hatalı kullanıcı adı, şifre veya rol seçimi!");
    }
}

function logout() {
    localStorage.removeItem("active_user");
    cart = []; // Çıkış yapınca sepeti sıfırla
    updateCartBtn();
    alert("Hesaptan çıkış yapıldı.");
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    showScreen('screen-role');
}

// --- 3. MAĞAZA, FİLTRE VE SEPET ---
function renderProducts(list = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = ""; 
    
    if (list.length === 0) {
        grid.innerHTML = "<h3>Aradığınız kriterde ürün bulunamadı.</h3>";
        return;
    }

    list.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-icon">${p.img}</div>
                <h3 style="margin:5px 0;">${p.title}</h3>
                <p style="color:#ff4757; font-weight:bold; font-size:18px;">${p.price} TL</p>
                <p style="font-size:13px; color:gray; margin-bottom:15px;">Kategori: ${p.category}</p>
                <button class="btn" style="width:100%; margin:0;" onclick="addToCart(${p.id})">Sepete Ekle</button>
            </div>
        `;
    });
}

function filterProducts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filtered = products.filter(p => {
        const matchName = p.title.toLowerCase().includes(searchText);
        const matchCat = category === "all" || p.category === category;
        return matchName && matchCat;
    });

    renderProducts(filtered);
}

function addToCart(id) {
    const selectedProduct = products.find(p => p.id === id);
    cart.push(selectedProduct);
    updateCartBtn();
    alert(`${selectedProduct.title} sepetinize eklendi! 🛒`);
}

function updateCartBtn() {
    document.getElementById('cart-btn').innerText = `🛒 Sepet (${cart.length})`;
}