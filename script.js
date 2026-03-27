const API_URL = "https://shopin-ssth.onrender.com";

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const container = document.getElementById('product-grid');
        
        // "Yükleniyor" yazısını temizle
        container.innerHTML = ""; 

        products.forEach(item => {
            // Çoklu görsel desteği (ilk görseli al, yoksa placeholder koy)
            const mainImg = (item.images && item.images.length > 0) ? item.images[0] : `https://via.placeholder.com/300x220?text=${item.name}`;
            
            // Stok durumuna göre renk (RE-01)
            const stockStatus = item.stock > 0 ? `<span style="color:#27ae60;">Stokta: ${item.stock} Adet</span>` : `<span style="color:#c0392b;">Tükendi</span>`;

            container.innerHTML += `
                <div class="product-card">
                    <div class="image-box">
                        <img src="${mainImg}" class="product-img">
                        ${item.images && item.images.length > 1 ? `<span class="img-badge">+${item.images.length - 1} Görsel</span>` : ''}
                    </div>
                    
                    <div class="product-info">
                        <h3 class="product-name">${item.name || 'İsimsiz Ürün'}</h3>
                        <p class="product-price">${item.price || 0} TL</p>
                        <p class="stock-info">${stockStatus}</p>
                    </div>

                    <div class="btn-group">
                        <button class="buy-btn" onclick="alert('POST /cart isteği gönderildi!')">Sepete Ekle (POST)</button>
                        <button class="delete-btn" onclick="alert('DELETE /products/${item._id} tetiklendi!')">Ürünü Kaldır (Yönetici)</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        document.getElementById('product-grid').innerHTML = "<p style='text-align:center; color:red; grid-column:1/-1;'>API Bağlantı Hatası!</p>";
    }
}

// Sayfa açıldığında çalıştır
fetchProducts();