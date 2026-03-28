

// 1. Katalog Listeleme (RE-01)
function ismailListProducts() {
    logIsmail("GET /products: Tüm ürün kataloğu çekildi. (RE-01)");
}

// 2. Ürün Detay Sorgulama (RE-02)
function ismailProductDetail(id) {
    logIsmail(`GET /products/${id}: Ürün detay verileri çekildi. (RE-02)`);
    alert("Ürün Detayı: ShopIn Özel Koleksiyon Ürünü.");
}

// 3. Kullanıcı Kayıt (RE-03)
function ismailRegister() {
    const name = prompt("Kayıt için isim giriniz:");
    if(name) {
        logIsmail(`POST /users/register: ${name} kullanıcısı oluşturuldu. (RE-03)`);
        alert(`Kayıt Başarılı! Hoş geldin ${name}.`);
    }
}

// 4. Kullanıcı Giriş (RE-04)
function ismailLogin() {
    localStorage.setItem("isLoggedIn", "true");
    document.getElementById('auth-tag').innerText = "👤 Durum: Giriş Yapıldı";
    logIsmail("POST /users/login: Kimlik doğrulandı, giriş başarılı. (RE-04)");
    alert("Giriş yapıldı! Artık Ebrar'ın sepet sistemini kullanabilirsiniz.");
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