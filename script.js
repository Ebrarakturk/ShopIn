let currentRole = "";

// Ekran Değiştirme Motoru
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active-screen'));
    document.getElementById(screenId).classList.add('active-screen');
}

// Rol Seçimi Sonrası Formu Aç
function showAuth(role) {
    currentRole = role;
    document.getElementById('auth-title').innerText = role === 'admin' ? "Yönetici Paneli" : "Kullanıcı Paneli";
    showScreen('screen-auth');
}

// 1. ŞİFRELİ KAYIT OLMA
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

    // Yeni Kullanıcıyı Veritabanına Ekle
    db.push({ username: user.toLowerCase(), password: pass, role: currentRole });
    localStorage.setItem("shopin_db", JSON.stringify(db));
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
}

// 2. ŞİFRELİ GİRİŞ YAPMA
function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    let db = JSON.parse(localStorage.getItem("shopin_db")) || [];
    
    // Kullanıcı Adı ve Şifre Eşleşmesi Kontrolü
    const foundUser = db.find(u => u.username === user.toLowerCase() && u.password === pass && u.role === currentRole);

    if (foundUser) {
        localStorage.setItem("active_user", foundUser.username);
        alert(`Hoş geldin ${foundUser.username}!`);
        showScreen('screen-store'); // Ana mağazaya yönlendir
    } else {
        alert("Hatalı kullanıcı adı, şifre veya rol seçimi!");
    }
}

// 3. ÇIKIŞ YAPMA
function logout() {
    localStorage.removeItem("active_user");
    alert("Hesaptan çıkış yapıldı.");
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    showScreen('screen-role'); // En başa dön
}