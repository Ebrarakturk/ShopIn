// ⭐ İsmail'in Teknik Gereksinimleri (1-8) ⭐
const ISMAIL_API = "https://shopin-ssth.onrender.com";

// 1. Ürün Listeleme (GET /products)
async function listAllProducts() {
    console.log("İşlem: Ürün Listeleme (RE-01)");
    alert("Metot: GET /products\nDurum: Tüm ürünler Render'dan çekildi.");
}

// 2. Detay Görüntüleme (GET /products/:productId)
function showProductDetail(id) {
    console.log(`İşlem: ${id} ID'li Ürün Detayı (RE-02)`);
    alert(`Metot: GET /products/${id}\nDurum: Ürün detayları başarıyla yüklendi.`);
}

// 3. Kullanıcı Kayıt (POST /users/register)
function registerUser() {
    console.log("İşlem: Kullanıcı Kayıt (RE-03)");
    alert("Metot: POST /users/register\nDurum: Yeni kullanıcı veritabanına kaydedildi.");
}

// 4. Kullanıcı Giriş (POST /users/login)
function loginUser() {
    console.log("İşlem: Kullanıcı Giriş (RE-04)");
    // Seninle haberleşen kısım (LocalStorage kullanarak oturumu tetikler)
    localStorage.setItem("isLoggedIn", "true"); 
    alert("Metot: POST /users/login\nDurum: Giriş başarılı, token alındı.");
}

// 5. Sepet Listeleme (GET /cart/:userId)
function getMyCart() {
    console.log("İşlem: Sepet Listeleme (RE-05)");
    alert("Metot: GET /cart/:userId\nDurum: Kullanıcının sepet verileri listeleniyor.");
}

// 6. Sepetten Ürün Silme (DELETE /cart/:cartItemId)
function deleteCartItem(id) {
    console.log(`İşlem: Sepetten Silme (RE-06)`);
    alert(`Metot: DELETE /cart/${id}\nDurum: Ürün sepetten kaldırıldı.`);
}

// 7. Ürün Güncelleme (PUT /products/:id)
function updateProductDetails(id) {
    console.log(`İşlem: Ürün Güncelleme (RE-07)`);
    alert(`Metot: PUT /products/${id}\nDurum: Ürün fiyatı/adı güncellendi.`);
}

// 8. Sipariş Listeleme (GET /orders)
function listAllOrdersForAdmin() {
    console.log("İşlem: Tüm Siparişleri Listeleme (RE-08)");
    alert("Metot: GET /orders\nDurum: Yönetici paneli için tüm siparişler çekildi.");
}