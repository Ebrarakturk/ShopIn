

// 1. Katalog Listeleme (RE-01)
function ismailListProducts() {
    logIsmail("GET /products: Tüm ürün kataloğu çekildi. (RE-01)");
}

// 2. Ürün Detay Sorgulama (RE-02)
function ismailProductDetail(id) {
    logIsmail(`GET /products/${id}: Ürün detay verileri çekildi. (RE-02)`);
    alert("Ürün Detayı: ShopIn Özel Koleksiyon Ürünü.");
}

/// 3. Kullanıcı Kayıt (RE-03) - Mükerrer Kontrolü Eklendi
function ismailRegister() {
    const name = prompt("Kayıt için isim giriniz:");
    
    if (name) {
        // Tarayıcı hafızasından mevcut listeyi çek (yoksa boş liste oluştur)
        let savedUsers = JSON.parse(localStorage.getItem("shopin_users")) || [];

        // Küçük/Büyük harf duyarlılığını kaldırmak için ismi küçültüp kontrol et
        if (savedUsers.includes(name.toLowerCase())) {
            logIsmail(`HATA: '${name}' zaten kayıtlı! (RE-03)`);
            alert(`Hata: '${name}' ismiyle zaten bir kaydınız var. Lütfen başka bir isim deneyin.`);
        } else {
            // Listeye ekle ve hafızaya geri kaydet
            savedUsers.push(name.toLowerCase());
            localStorage.setItem("shopin_users", JSON.stringify(savedUsers));

            logIsmail(`POST /users/register: ${name} başarıyla oluşturuldu. (RE-03)`);
            alert(`Kayıt Başarılı! Hoş geldin ${name}.`);
        }
    }
}

// 4. Kullanıcı Giriş (RE-04) - Veritabanı Kontrollü
function ismailLogin() {
    const name = prompt("Giriş yapmak için ShopIn kullanıcı adınızı giriniz:");
    
    if (name) {
        // Kayıtlı kullanıcıları hafızadan çek
        let savedUsers = JSON.parse(localStorage.getItem("shopin_users")) || [];
        
        // Girilen isim kayıtlı mı diye kontrol et
        if (savedUsers.includes(name.toLowerCase())) {
            // ✅ Giriş Başarılı
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", name.toLowerCase()); // Kimin girdiği belli olsun
            
            // Arayüzdeki "Ziyaretçi" yazısını güncelle
            const authTag = document.getElementById('auth-tag');
            if (authTag) authTag.innerText = `👤 Durum: ${name} (Giriş Yapıldı)`;
            
            logIsmail(`POST /users/login: ShopIn kullanıcısı '${name}' başarıyla giriş yaptı. (200 OK) (RE-04)`);
            alert(`Giriş başarılı! ShopIn'e hoş geldin, ${name}. Artık sepete ürün ekleyebilirsiniz.`);
        } else {
            // 🚨 Hata: Kullanıcı Yok
            logIsmail(`HATA: '${name}' adında bir ShopIn kullanıcısı bulunamadı! (404 Not Found) (RE-04)`);
            alert(`Hata: '${name}' isminde bir kayıt bulunamadı. Lütfen önce 'Kayıt Ol' butonunu kullanarak ShopIn'e üye olun.`);
        }
    }
}

// 5. Aktif Sepet Listeleme (RE-05)
function ismailGetCart() {
    logIsmail("GET /cart/user123: Mevcut sepet içeriği getirildi. (RE-05)");
}

// 6. Sepetten Ürün Kaldırma (RE-06)
function ismailDeleteCart() {
    logIsmail("DELETE /cart/item456: Ürün sepetten silindi. (RE-06)");
    alert("Ürün sepetten çıkarıldı.");
}

// 7. Ürün Verisi Güncelleme (RE-07)
function ismailUpdateProduct() {
    logIsmail("PUT /products/update: Ürün bilgileri revize edildi. (RE-07)");
    alert("Ürün bilgileri güncellendi.");
}

// 8. Sistem Sipariş Listesi (RE-08)
function ismailListAllOrders() {
    logIsmail("GET /orders/all: Yönetici için tüm siparişler listelendi. (RE-08)");
}

// Yardımcı Fonksiyon (Log Paneli İçin)
function logIsmail(message) {
    const logContent = document.getElementById('log-content');
    if (logContent) {
        logContent.innerHTML += `<br> <span style="color:#61affe;">> [İsmail]:</span> ${message}`;
        logContent.scrollTop = logContent.scrollHeight;
    }
}