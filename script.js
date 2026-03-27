// Senin Render linkin
const API_URL = "https://shopin-ssth.onrender.com";

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const container = document.getElementById('product-list');
        
        // Önceki "Yükleniyor..." yazısını temizle
        container.innerHTML = ""; 

        // Eğer ürün yoksa mesaj göster
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Şu an mağazada ürün bulunmamaktadır.</p>';
            return;
        }

        products.forEach(item => {
            // Eğer MongoDB'de 'name' yerine 'urun_adi' gibi bir alan varsa, hocaya videoda
            // göstermek için MongoDB'yi düzenlemen gerekecek. Şu an 'name' bekliyoruz.
            const name = item.name || "İsimsiz Ürün (Check MongoDB Fields)";
            const price = item.price || "Sıfır";
            const stock = item.stock || "Tükenmiş";

            // 🔥 Profesyonel Ürün Kartı Tasarımı 🔥
            container.innerHTML += `
                <div class="product-card">
                    <img src="https://via.placeholder.com/300x180.png?text=Ebrar'ın Mağazası" alt="${name}" class="product-image">
                    <h3 class="product-name">${name}</h3>
                    <p class="product-price">${price} TL</p>
                    <p><span class="product-stock">Stok: ${stock}</span></p>
                    <button class="buy-btn">Satın Al</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Bağlantı Hatası:", error);
        document.getElementById('product-list').innerHTML = `<p style="text-align:center; color:red;">Veri yüklenemedi. (Error: CORS kilidi tam açık mı?)</p>`;
    }
}

// Sayfa yüklendiğinde verileri çek
fetchProducts();