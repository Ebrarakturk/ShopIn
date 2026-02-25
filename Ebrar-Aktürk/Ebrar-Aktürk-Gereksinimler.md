1. **Stok Görüntüleme**
   - **API Metodu:** `GET /products/stock`
   - **Açıklama:** Sistemde bulunan ürünlerin stok bilgilerinin görüntülenmesini sağlar. Kullanıcılar ürünlerin mevcut stok miktarını görebilir. Bu işlem hem kullanıcılar hem de yöneticiler tarafından görüntülenebilir.

2. **Ürün Filtreleme**
   - **API Metodu:** `GET /products?filter=…`
   - **Açıklama:** Ürünlerin kategori, fiyat aralığı veya isim gibi kriterlere göre filtrelenmesini sağlar. Kullanıcılar aradıkları ürünü daha hızlı bulabilir. Giriş yapılmadan da kullanılabilir.

3. **Sepete Ürün Ekleme**
   - **API Metodu:** `POST /cart`
   - **Açıklama:** Kullanıcının seçtiği ürünü sepete eklemesini sağlar. Ürün ID ve adet bilgisi gönderilir. Güvenlik nedeniyle kullanıcının sisteme giriş yapmış olması gerekir.

4. **Sipariş Oluşturma**
   - **API Metodu:** `POST /orders`
   - **Açıklama:** Kullanıcının sepetindeki ürünlerden sipariş oluşturmasını sağlar. Sipariş oluşturulduğunda stok kontrolü yapılır ve sipariş kaydı oluşturulur. Kullanıcının giriş yapmış olması zorunludur.
     
5. **Sipariş Listeleme**
   - **API Metodu:** `GET /orders`
   - **Açıklama:** Kullanıcının geçmiş siparişlerini görüntülemesini sağlar. Kullanıcı yalnızca kendi siparişlerini görebilir. Yönetici tüm siparişleri listeleyebilir. Giriş yapılmış olmalıdır.

6. **Ürün Ekleme**
   - **API Metodu:** `POST /products`
   - **Açıklama:** Sisteme yeni ürün eklenmesini sağlar. Ürün adı, fiyat, kategori ve stok bilgileri girilir. Bu işlem yalnızca yönetici tarafından yapılabilir.

7. **Ürün Silme**
   - **API Metodu:** ` DELETE /products/{productId}`
   - **Açıklama:** Sistemde bulunan bir ürünün silinmesini sağlar. Bu işlem yalnızca yönetici tarafından gerçekleştirilebilir.

8. **Sipariş Durumu Güncelleme**
   - **API Metodu:** `PUT /orders/{orderId}`
   - **Açıklama:** Oluşturulmuş bir siparişin durumunun (Hazırlanıyor, Kargoya Verildi, Teslim Edildi vb.) güncellenmesini sağlar. Bu işlem yalnızca yönetici tarafından yapılabilir.
