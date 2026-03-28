let currentRole = "";
let cart = []; 

const products = [
    { id: 1, title: "Akıllı Saat v2", price: 2499, category: "Elektronik", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=300&auto=format&fit=crop", stock: 12, desc: "Gelişmiş adım sayar ve kalp ritmi ölçer.", specs: "Bluetooth 5.0, Su Geçirmez" },
    { id: 2, title: "Kablosuz Kulaklık", price: 899, category: "Elektronik", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop", stock: 8, desc: "Gürültü engelleyici (ANC) özellikli.", specs: "20 saat pil ömrü, Mikrofonlu" },
    { id: 3, title: "Oyun Laptopu X", price: 34500, category: "Elektronik", img: "https://images.unsplash.com/photo-1603302576837-37561b2fe18d?q=80&w=300&auto=format&fit=crop", stock: 5, desc: "Yüksek FPS garantili oyuncu bilgisayarı.", specs: "RTX 4060, 16GB RAM, 1TB SSD" },
    { id: 4, title: "Tablet Pro 11", price: 12500, category: "Elektronik", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300&auto=format&fit=crop", stock: 15, desc: "Çizim ve ofis işleri için ideal.", specs: "11 inç, Kalem destekli" },
    { id: 5, title: "Mekanik Klavye", price: 1250, category: "Elektronik", img: "https://images.unsplash.com/photo-1618384800394-2210a9964b19?q=80&w=300&auto=format&fit=crop", stock: 20, desc: "RGB aydınlatmalı, Blue Switch klavye.", specs: "Kablolu, Türkçe Q" },
    { id: 6, title: "Oyuncu Mouse", price: 450, category: "Elektronik", img: "https://images.unsplash.com/photo-1527698202070-aaa7b41940ff?q=80&w=300&auto=format&fit=crop", stock: 25, desc: "Hassas sensörlü ve makro tuşlu.", specs: "16000 DPI, Optik" },
    { id: 7, title: "4K Monitör", price: 7800, category: "Elektronik", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop", stock: 7, desc: "Göz yormayan IPS panel.", specs: "27 inç, 144Hz" },
    { id: 8, title: "Aksiyon Kamerası", price: 4200, category: "Elektronik", img: "https://images.unsplash.com/photo-1520630663809-541249c5851f?q=80&w=300&auto=format&fit=crop", stock: 10, desc: "Su altı çekimlerine uygun 4K kamera.", specs: "Wi-Fi, 60 FPS" },
    { id: 9, title: "Klasik Deri Ceket", price: 1850, category: "Giyim", img: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=300&auto=format&fit=crop", stock: 5, desc: "Hakiki deri, kış aylarının vazgeçilmezi.", specs: "Beden: L, Renk: Siyah" },
    { id: 10, title: "Basic Beyaz Tişört", price: 250, category: "Giyim", img: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=300&auto=format&fit=crop", stock: 50, desc: "%100 Pamuk, rahat kesim.", specs: "Beden: M, Yazlık" },
    { id: 11, title: "Kot Pantolon", price: 650, category: "Giyim", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=300&auto=format&fit=crop", stock: 30, desc: "Dar kesim esnek jean.", specs: "Beden: 32/32, Mavi" },
    { id: 12, title: "Spor Ayakkabı", price: 1450, category: "Giyim", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=300&auto=format&fit=crop", stock: 18, desc: "Koşu ve yürüyüş için ortopedik taban.", specs: "Numara: 42, Nefes Alabilir" },
    { id: 13, title: "Kışlık Kazak", price: 480, category: "Giyim", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=300&auto=format&fit=crop", stock: 22, desc: "Yün karışımlı sıcak tutan kazak.", specs: "Beden: XL, Bordo" },
    { id: 14, title: "Oduncu Gömleği", price: 390, category: "Giyim", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1a801?q=80&w=300&auto=format&fit=crop", stock: 14, desc: "Kareli desenli, kalın kumaş.", specs: "Beden: L, Kırmızı-Siyah" },
    { id: 15, title: "Yazlık Elbise", price: 550, category: "Giyim", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop", stock: 16, desc: "Çiçek desenli uçuş uçuş elbise.", specs: "Beden: S, Keten" },
    { id: 16, title: "Şapka", price: 120, category: "Giyim", img: "https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=300&auto=format&fit=crop", stock: 40, desc: "Güneş korumalı spor şapka.", specs: "Standart Beden" },
    { id: 17, title: "Dünya Klasikleri Seti", price: 350, category: "Kitap", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300&auto=format&fit=crop", stock: 20, desc: "En çok okunan 5 klasik roman.", specs: "Ciltli, 1500 sayfa" },
    { id: 18, title: "Bilim Kurgu Antolojisi", price: 180, category: "Kitap", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop", stock: 25, desc: "Gelecekten hikayeler.", specs: "Karton Kapak, 320 Sayfa" },
    { id: 19, title: "Modern Tarih", price: 210, category: "Kitap", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop", stock: 12, desc: "20. Yüzyılın detaylı incelemesi.", specs: "Araştırma, 450 Sayfa" },
    { id: 20, title: "Felsefeye Giriş", price: 140, category: "Kitap", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop", stock: 35, desc: "Temel akımlar ve düşünürler.", specs: "Eğitim, 280 Sayfa" },
    { id: 21, title: "Kişisel Gelişim", price: 130, category: "Kitap", img: "https://images.unsplash.com/photo-1506880125313-284e03f56616?q=80&w=300&auto=format&fit=crop", stock: 40, desc: "Motivasyon ve başarı sırları.", specs: "İnce Kapak" },
    { id: 22, title: "Şiir Seçkisi", price: 90, category: "Kitap", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop", stock: 15, desc: "En sevilen yerli ve yabancı şiirler.", specs: "Cep Boy" },
    { id: 23, title: "Filtre Kahve Makinesi", price: 1100, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1595434091143-b375ace5d541?q=80&w=300&auto=format&fit=crop", stock: 9, desc: "Zamanlayıcılı ve sıcak tutma özellikli.", specs: "12 Fincan Kapasiteli" },
    { id: 24, title: "Robot Süpürge", price: 9500, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1634591461623-288f61536f9b?q=80&w=300&auto=format&fit=crop", stock: 4, desc: "Haritalamalı akıllı temizlik robotu.", specs: "Wi-Fi, Mop Özellikli" },
    { id: 25, title: "Tost Makinesi", price: 850, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1610488219018-9c16503c1b69?q=80&w=300&auto=format&fit=crop", stock: 11, desc: "Döküm plakalı, 6 dilim kapasiteli.", specs: "1800W" },
    { id: 26, title: "Blender Seti", price: 720, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1589136979569-450f7823b497?q=80&w=300&auto=format&fit=crop", stock: 14, desc: "Doğrayıcı ve çırpıcı aparatlı.", specs: "1000W, Paslanmaz Çelik" },
    { id: 27, title: "Buharlı Ütü", price: 1300, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1602755227742-998818815a51?q=80&w=300&auto=format&fit=crop", stock: 17, desc: "Seramik tabanlı, şok buharlı.", specs: "2400W" },
    { id: 28, title: "Airfryer", price: 3400, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1638685160910-388f668407ff?q=80&w=300&auto=format&fit=crop", stock: 8, desc: "Yağsız fritöz, sağlıklı kızartmalar.", specs: "5.5 Litre, Dijital Ekran" },
    { id: 29, title: "Mikrodalga Fırın", price: 2100, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1630130831688-a73c063428d0?q=80&w=300&auto=format&fit=crop", stock: 6, desc: "Buz çözme fonksiyonlu pratik fırın.", specs: "20 Litre Kapasite" },
    { id: 30, title: "Saç Kurutma Makinesi", price: 450, category: "Ev Aletleri", img: "https://images.unsplash.com/photo-1522338140262-f46f5912018a?q=80&w=300&auto=format&fit=crop", stock: 22, desc: "İyonik özellikli, profesyonel motor.", specs: "2200W, 2 Başlık" }
];

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active-screen'));
    document.getElementById(screenId).classList.add('active-screen');
}

function showAuth(role) {
    currentRole = role;
    document.getElementById('auth-title').innerText = role === 'admin' ? "Yönetici Paneli" : "Kullanıcı Paneli";
    showScreen('screen-auth');
}

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

    if (currentRole === 'admin') {
        if (user === "admin" && pass === "shopin123") {
            localStorage.setItem("active_user", "Sistem Yöneticisi");
            document.getElementById('account-title').innerText = `👑 SİSTEM YÖNETİCİSİ`;
            alert("Hoş geldin Patron! Tüm yetkilerle giriş yapıldı.");
            showScreen('screen-store'); renderProducts();
            return; 
        } else {
            return alert("⛔ Hatalı yönetici giriş denemesi.");
        }
    }

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

// --- FAVORİLER VERİTABANI VE YÖNETİMİ (YENİ) ---
function getFavorites() {
    const currentUser = localStorage.getItem("active_user");
    return JSON.parse(localStorage.getItem(`favs_${currentUser}`)) || [];
}

function toggleFavorite(id) {
    const currentUser = localStorage.getItem("active_user");
    if (!currentUser) return; // Giriş yapmamışsa işlem yapma

    let favs = getFavorites();
    const index = favs.indexOf(id);
    
    if (index === -1) {
        favs.push(id); // Listede yoksa ekle
    } else {
        favs.splice(index, 1); // Listede varsa çıkar
    }
    
    localStorage.setItem(`favs_${currentUser}`, JSON.stringify(favs));
    
    // Ekranda değişiklikleri anında göster
    renderProducts(); 
    
    // Eğer şu an favoriler ekranındaysa orayı da güncelle
    if (document.getElementById('screen-favorites').classList.contains('active-screen')) {
        showFavorites();
    }
}

// --- MAĞAZA VE ÜRÜNLER (Kalp İkonları Eklendi) ---
function renderProducts(list = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = ""; 
    if (list.length === 0) return grid.innerHTML = "<h3 style='width:100%;'>Aradığınız kriterde ürün bulunamadı.</h3>";

    const currentFavs = getFavorites(); // Kullanıcının favorilerini çek

    list.forEach(p => {
        // Ürün favorilerdeyse kırmızı kalp (❤️), değilse beyaz kalp (🤍) göster
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

// --- FAVORİLER EKRANINI GÖSTERME (YENİ) ---
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
                    <img src="${p.img}" alt="${p.title}" class="product-img" onclick="showProductDetail(${p.id})">
                    <h3 style="margin:5px 0; font-size:16px; font-weight:600;">${p.title}</h3>
                    <p style="font-weight:800; font-size:18px; margin: 5px 0;">${p.price} TL</p>
                    <button class="btn btn-outline" style="width:100%; margin:0 0 8px 0;" onclick="showProductDetail(${p.id})">Detay İncele</button>
                    <button class="btn" style="width:100%; margin:0;" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>Sepete Ekle</button>
                </div>
            `;
        });
    }
    showScreen('screen-favorites');
}

// --- ÜRÜN DETAY SAYFASI ---
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

// --- SEPET VE SİPARİŞ ---
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    if (cart.filter(item => item.id === id).length >= p.stock) return alert(`Hata: Stokta sadece ${p.stock} adet var.`);
    cart.push(p); updateCartBtn();
}

function showCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; font-size: 16px; color: #666;'>Sepetiniz şu an boş.</p>";
        document.getElementById('cart-total').innerText = "Toplam: 0 TL";
        showScreen('screen-cart'); return;
    }
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <div style="display:flex; align-items:center;"><img src="${item.img}" class="cart-item-img"><strong style="font-size: 15px;">${item.title}</strong></div>
                <div style="display:flex; align-items:center;"><span style="font-weight:800; margin-right:20px; font-size:16px;">${item.price} TL</span><button class="btn btn-outline" style="margin:0; padding:5px 15px; border-color: #ff4757; color: #ff4757;" onclick="removeFromCart(${index})">Sil</button></div>
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

    const newOrder = { username: currentUser, date: new Date().toLocaleString('tr-TR'), items: [...cart], total: totalAmount };

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

    alert("Sipariş başarıyla alındı! Geçmiş siparişlerinizi 'Hesabım' bölümünden görebilirsiniz.");
    cart = []; updateCartBtn(); showScreen('screen-store'); renderProducts(); 
}

function showAccountScreen() {
    const currentUser = localStorage.getItem("active_user");
    const container = document.getElementById('order-history-list');
    const subtitle = document.getElementById('account-subtitle');
    
    container.innerHTML = ""; 
    let ordersToShow = [];

    if (currentUser === "Sistem Yöneticisi") {
        subtitle.innerText = "🌐 Sistemdeki Tüm Müşteri Siparişleri";
        ordersToShow = JSON.parse(localStorage.getItem("shopin_all_orders")) || [];
        
        if (ordersToShow.length === 0) {
            container.innerHTML = "<p style='color: #666;'>Sistemde henüz hiç sipariş yok.</p>";
        } else {
            [...ordersToShow].reverse().forEach((order) => {
                let itemsHtml = order.items.map(item => `
                    <li style="display:flex; align-items:center; gap:10px; margin-bottom:5px; font-size: 14px;">
                        <img src="${item.img}" style="width:30px; height:30px; object-fit:contain; border: 1px solid #eee;">
                        ${item.title}
                    </li>
                `).join('');
                container.innerHTML += `
                    <div style="border: 2px solid #000; padding: 20px; margin-bottom: 20px; border-radius: 8px; text-align: left; background: #fafafa;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px;">
                            <div><div style="font-weight: 900; color: #ff4757; font-size: 16px; margin-bottom: 5px; text-transform: uppercase;">👤 Müşteri: ${order.username}</div><div style="font-weight: 600; color: #666; font-size: 12px;">🕒 ${order.date}</div></div>
                            <span style="font-weight: 900; font-size: 18px;">${order.total} TL</span>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style:none;">${itemsHtml}</ul>
                    </div>
                `;
            });
        }
    } else {
        subtitle.innerText = "📦 Geçmiş Siparişlerim";
        ordersToShow = JSON.parse(localStorage.getItem(`orders_${currentUser}`)) || [];
        
        if (ordersToShow.length === 0) {
            container.innerHTML = "<p style='color: #666;'>Henüz geçmiş siparişiniz bulunmamaktadır.</p>";
        } else {
            [...ordersToShow].reverse().forEach((order) => {
                let itemsHtml = order.items.map(item => `
                    <li style="display:flex; align-items:center; gap:10px; margin-bottom:10px; font-size: 14px; font-weight: 500;">
                        <img src="${item.img}" style="width:40px; height:40px; object-fit:contain; border: 1px solid #eee; border-radius:4px;">
                        ${item.title}
                    </li>
                `).join('');
                container.innerHTML += `
                    <div style="border: 1px solid #eee; padding: 20px; margin-bottom: 20px; border-radius: 8px; text-align: left; background: #fafafa;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px;">
                            <span style="font-weight: 600; color: #666; font-size: 14px;">${order.date}</span>
                            <span style="font-weight: 900; font-size: 18px;">${order.total} TL</span>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style:none;">${itemsHtml}</ul>
                    </div>
                `;
            });
        }
    }
    showScreen('screen-account');
}