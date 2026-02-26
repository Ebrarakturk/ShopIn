# TÜM GEREKSİNİMLER
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
     
8. **Sipariş Listeleme**
- **API Metodu:** `GET /admin/orders`
- **Açıklama:** Yönetici paneli için tüm kullanıcı siparişlerini listeler
     
9. **Stok Görüntüleme**
- **API Metodu:** `GET /products/stock`
- **Açıklama:** Sistemde bulunan ürünlerin stok bilgilerinin görüntülenmesini sağlar. Kullanıcılar ürünlerin mevcut stok miktarını görebilir. Bu işlem hem kullanıcılar hem de yöneticiler tarafından görüntülenebilir.

10. **Ürün Filtreleme**
- **API Metodu:** `GET /products?filter=…`
- **Açıklama:** Ürünlerin kategori, fiyat aralığı veya isim gibi kriterlere göre filtrelenmesini sağlar. Kullanıcılar aradıkları ürünü daha hızlı bulabilir. Giriş yapılmadan da kullanılabilir.

11. **Sepete Ürün Ekleme**
- **API Metodu:** `POST /cart`
- **Açıklama:** Kullanıcının seçtiği ürünü sepete eklemesini sağlar. Ürün ID ve adet bilgisi gönderilir. Güvenlik nedeniyle kullanıcının sisteme giriş yapmış olması gerekir.

12. **Sipariş Oluşturma**
- **API Metodu:** `POST /orders`
- **Açıklama:** Kullanıcının sepetindeki ürünlerden sipariş oluşturmasını sağlar. Sipariş oluşturulduğunda stok kontrolü yapılır ve sipariş kaydı oluşturulur. Kullanıcının giriş yapmış olması zorunludur.
     
13. **Sipariş Listeleme**
- **API Metodu:** `GET /orders`
- **Açıklama:** Kullanıcının geçmiş siparişlerini görüntülemesini sağlar. Kullanıcı yalnızca kendi siparişlerini görebilir. Yönetici tüm siparişleri listeleyebilir. Giriş yapılmış olmalıdır.

14. **Ürün Ekleme**
- **API Metodu:** `POST /products`
- **Açıklama:** Sisteme yeni ürün eklenmesini sağlar. Ürün adı, fiyat, kategori ve stok bilgileri girilir. Bu işlem yalnızca yönetici tarafından yapılabilir.

15. **Ürün Silme**
- **API Metodu:** ` DELETE /products/{productId}`
- **Açıklama:** Sistemde bulunan bir ürünün silinmesini sağlar. Bu işlem yalnızca yönetici tarafından gerçekleştirilebilir.

16. **Sipariş Durumu Güncelleme**
- **API Metodu:** `PUT /orders/{orderId}`
- **Açıklama:** Oluşturulmuş bir siparişin durumunun (Hazırlanıyor, Kargoya Verildi, Teslim Edildi vb.) güncellenmesini sağlar. Bu işlem yalnızca yönetici tarafından yapılabilir.



# Gereksinim Dağılımları

1.[İsmail Taşinen'in Gereksinimleri](İsmail-Taşinen/İsmail-Taşinen-Gereksinimler.md) 

2.[Ebrar Aktürk'ün Gereksinimleri](Ebrar-Aktürk-Gereksinimler.md)
