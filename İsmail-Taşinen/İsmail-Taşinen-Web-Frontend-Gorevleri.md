İsmail Taşinen'in Web Frontend Görevleri

**Front-end Test Videosu:** [video]()
### 1. Ürün Listeleme Sayfası/Bileşeni

* **API Endpoint:** `GET /products`
* **Görev:** Sistemdeki tüm ürünlerin ana sayfa veya mağaza bölümünde listelenmesi.
* **UI Bileşenleri:**
  * Ürün görseli, ürün başlığı ve fiyatını barındıran ürün kartları.
  * Responsive (duyarlı) grid veya flexbox yapısı.
  * Kartlar üzerinde "Sepete Ekle" ve "Detayı İncele" butonları.
* **Kullanıcı Deneyimi:**
  * Veriler yüklenirken ekranda bekleme animasyonu (Loading spinner veya Skeleton) gösterilmesi.
  * Ürün kartının üzerine fare ile gelindiğinde (hover) hafif bir gölge veya yukarı kayma animasyonu.
* **Teknik Detaylar:**
  * Bileşen ilk render edildiğinde (`useEffect` ile) ürünlerin çekilmesi.
  * Gelen verilerin client-side state'te (örn. `useState`) tutulması ve map fonksiyonu ile ekrana basılması.

---

### 2. Detay Görüntüleme Sayfası/Bileşeni

* **API Endpoint:** `GET /products/{productId}`
* **Görev:** Seçilen bir ürünün detaylı açıklamalarının, görsellerinin ve stok bilgisinin kullanıcıya sunulması.
* **UI Bileşenleri:**
  * Büyük ürün görseli ve varsa görsel galerisi.
  * Ürün adı, detaylı metin açıklaması, fiyat etiketi.
  * Miktar seçici (artırma/azaltma butonları) ve dikkat çekici bir "Sepete Ekle" butonu.
* **Kullanıcı Deneyimi:**
  * Başka bir sayfadan tıklandığında anında ürün detay sayfasına (Router aracılığıyla) geçiş yapılması.
  * Ürün stokta yoksa "Sepete Ekle" butonunun tıklanamaz (disabled) hale gelmesi.
* **Teknik Detaylar:**
  * URL'den dinamik ID parametresinin (örn. `useParams` ile) alınarak API'ye istek atılması.
  * Ürün bulunamadığı durumda (404) kullanıcı dostu bir "Ürün Bulunamadı" boş durum (empty state) ekranının render edilmesi.

---

### 3. Kullanıcı Kayıt Formu/Bileşeni

* **API Endpoint:** `POST /users/register`
* **Görev:** Yeni kullanıcıların sisteme üye olması için gerekli bilgileri girmesini sağlamak.
* **UI Bileşenleri:**
  * Kullanıcı adı, e-posta ve şifre için form input alanları.
  * Şifre görünürlüğünü değiştiren (aç/kapat) göz ikonu.
  * "Kayıt Ol" onay butonu.
* **Kullanıcı Deneyimi:**
  * Hatalı veya eksik bilgi girişinde inputların altında anında (real-time) kırmızı renkli doğrulama hatalarının belirmesi.
  * Kayıt başarılı olduğunda kullanıcıya bildirim (Toast) gösterilmesi ve giriş yap ekranına yönlendirme.
* **Teknik Detaylar:**
  * Form gönderiminin varsayılan sayfa yenileme davranışının engellenmesi (`e.preventDefault()`).
  * Girdi verilerinin kontrollü bileşenler (controlled components) aracılığıyla state içerisinde güncel tutulması.

---

### 4. Kullanıcı Giriş Formu/Bileşeni

* **API Endpoint:** `POST /users/login`
* **Görev:** Kayıtlı kullanıcıların e-posta ve şifre ile sistemde oturum açmasını sağlamak.
* **UI Bileşenleri:**
  * E-posta (`type="email"`) ve Şifre (`type="password"`) giriş alanları.
  * "Giriş Yap" butonu ve "Hesabın yok mu? Kayıt Ol" yönlendirme linki.
* **Kullanıcı Deneyimi:**
  * Başarılı giriş sonrasında kullanıcının yetkisine göre ana sayfaya veya yönetici paneline pürüzsüz yönlendirilmesi.
  * Bilgiler yanlışsa "E-posta veya şifre hatalı" şeklinde net bir geri bildirim mesajı.
* **Teknik Detaylar:**
  * Giriş sonrası API'den dönen kimlik doğrulama token'ının `localStorage` veya `sessionStorage` içerisine güvenli bir şekilde kaydedilmesi.
  * Tüm uygulamanın kimlik doğrulama durumunu (isLoggedIn) dinleyen yapının (Context veya Redux) güncellenmesi.

---

### 5. Sepet Görüntüleme Sayfası/Bileşeni

* **API Endpoint:** `GET /cart/{userId}`
* **Görev:** Kullanıcının sepetine eklediği ürünlerin, adetlerinin ve toplam ödeme tutarının listelenmesi.
* **UI Bileşenleri:**
  * Her bir sepet ürünü için satır tasarımı (Görsel, ürün adı, adet seçici, birim fiyat).
  * Sepet ara toplamı, kargo ücreti ve genel toplamı gösteren "Sipariş Özeti" paneli.
  * "Alışverişi Tam
