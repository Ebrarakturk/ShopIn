1. **Ürün Listeleme**
   - **API Metodu:** ` GET /products`
   - **Açıklama:** Sistemdeki tüm ürünlerin listelenmesini sağlar.
     
2. **Detay Görüntüleme**
   - **API Metodu:** `GET /products/{productId}`
   - **Açıklama:**  Seçilen bir ürünün detaylı bilgilerini görüntüler.

3. **Kullanıcı Kayıt**
   - **API Metodu:** ` POST /auth/register`
   - **Açıklama:** Yeni kullanıcıların sisteme kayıt olmasını sağlar.

4. **Kullanıcı Giriş**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:**  Kayıtlı kullanıcıların sisteme giriş yapmasını sağlar.

5. **Sepet Listeleme**
   - **API Metodu:** `GET /cart`
   - **Açıklama:**  Kullanıcının sepetine eklediği ürünleri listeler.

6. **Sepetten Ürün Silme**
   - **API Metodu:** `DELETE /cart/{itemId}`
   - **Açıklama:** Sepetteki belirli bir ürünü sepetten kaldırır.

7. **Ürün Güncelleme**
   - **API Metodu:** ` PUT /admin/products/{productId}`
   - **Açıklama:** Mevcut bir ürünün bilgilerini düzenlemek için kullanılır.
     
8. **8. Sipariş Listeleme**
   - **API Metodu:** `GET /admin/orders`
   - **Açıklama:** Yönetici paneli için tüm kullanıcı siparişlerini listeler
