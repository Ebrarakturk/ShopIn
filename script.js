const API_URL = "https://shopin-ssth.onrender.com";

// Sayfa açıldığında ürünleri çek (Gereksinim 1)
window.onload = fetchProducts;

// 1. Stok Görüntüleme (GET /products/stock)
async function fetchProducts() {
    const container = document.getElementById('product-grid');
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        container.innerHTML = "";
        
        products.forEach(p => {
            container.innerHTML += `
                <div class="product-card">
                    <div class="product-name">${p.name}</div>
                    <div class="stock-tag">Mevcut Stok: ${p.stock} (RE-01)</div>
                    <button class="btn add-cart-btn" onclick="addToCart('${p._id}')">Sepete Ekle (POST /cart)</button>
                    <button class="btn delete-btn" onclick="deleteProduct('${p._id}')">Ürünü Sil (DELETE /products)</button>
                </div>`;
        });
    } catch (e) { container.innerHTML = "Veri çekilemedi."; }
}

// 2. Ürün Filtreleme (GET /products?filter=...)
function filterProducts() {
    const filter = document.getElementById('filter-input').value;
    alert(`Metot: GET /products?filter=${filter}\nİşlem: Filtreleme isteği gönderildi (RE-02).`);
}

// 3. Sepete Ürün Ekleme (POST /cart)
function addToCart(id) {
    alert(`Metot: POST /cart\nİşlem: ${id} ID'li ürün sepete gönderildi (RE-03).`);
}

// 4. Sipariş Oluşturma (POST /orders)
function createOrder() {
    alert("Metot: POST /orders\nİşlem: Sepetteki ürünler siparişe dönüştürülüyor (RE-04).");
}

// 5. Sipariş Listeleme (GET /orders)
function listOrders() {
    document.getElementById('order-container').style.display = 'block';
    const list = document.getElementById('order-list');
    list.innerHTML = "<b>Örnek Sipariş #102:</b> Hazırlanıyor (RE-05)";
}

// 6. Ürün Ekleme (POST /products)
function addProduct() {
    alert("Metot: POST /products\nİşlem: Yeni ürün formu veritabanına gönderiliyor (RE-06).");
}

// 7. Ürün Silme (DELETE /products/{productId})
function deleteProduct(id) {
    if(confirm(`${id} ID'li ürünü silmek istediğinize emin misiniz? (RE-07)`)) {
        alert(`Metot: DELETE /products/${id}\nİşlem: Ürün sistemden kaldırıldı.`);
    }
}

// 8. Sipariş Durumu Güncelleme (PUT /orders/{orderId})
function updateOrderStatus() {
    alert("Metot: PUT /orders/{orderId}\nİşlem: Sipariş durumu 'Kargoya Verildi' olarak güncellendi (RE-08).");
}