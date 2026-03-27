const API_URL = "https://shopin-ssth.onrender.com";

async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    const container = document.getElementById('product-list');
    
    data.forEach(item => {
        container.innerHTML += `
            <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                <h3>${item.name}</h3>
                <p>Fiyat: ${item.price} TL</p>
                <p>Stok: ${item.stock}</p>
            </div>
        `;
    });
}
loadProducts();