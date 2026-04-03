

## 1. Stok Görüntüleme Sayfası/Bileşeni

* **API Endpoint:** `GET /products/stock`
* **Görev:** Sistemde bulunan ürünlerin stok bilgilerinin görüntülenmesi (Kullanıcı ve Yönetici için ortak).
* **UI Bileşenleri:**
    * Ürün kartları üzerinde stok miktarını gösteren metin alanı.
    * Stok durumuna göre renklenen tipografi (Stok varsa yeşil, tükendiyse kırmızı).
    * Stok tükendiğinde disabled (tıklanamaz) hale gelen "Sepete Ekle" butonu.
* **Kullanıcı Deneyimi:**
    * Kullanıcıya ürünün mevcudiyeti hakkında anında görsel geri bildirim ("Stokta var" veya "Tükendi" ibareleri).
    * Sepete ekleme işlemi sırasında kullanıcının stok limitinden fazla ürün seçmesinin engellenmesi.
* **Teknik Detaylar:**
    * Ürün veritabanından (`localStorage`) anlık stok verisinin okunması.
    * Koşullu renderlama (Conditional rendering) ile UI güncellemeleri.
    * Client-side yetki kontrolü olmadan (herkese açık) veri gösterimi.

## 2. Ürün Filtreleme ve Arama Akışı

* **API Endpoint:** `GET /products?filter=...`
* **Görev:** Ürünlerin kategori veya isim gibi kriterlere göre filtrelenmesi.
* **UI Bileşenleri:**
    * Arama çubuğu (type="text", placeholder="Ürün Ara...").
    * Kategori seçimi için dropdown menüsü (`<select>`).
    * "Tüm Kategoriler" varsayılan seçeneği.
    * Sonuçların listelendiği responsive grid yapısı.
* **Kullanıcı Deneyimi:**
    * Klavye tuşuna basıldığı anda (real-time / `onkeyup`) sayfa yenilenmeden anında arama sonuçlarının listelenmesi.
    * Empty state tasarımı (Aranan kriterde ürün bulunamadığında kullanıcı dostu "Ürün bulunamadı" mesajı).
* **Teknik Detaylar:**
    * Client-side array filtreleme (`filter()` ve `includes()` metotları).
    * Case-insensitive (büyük/küçük harf duyarsız) arama algoritması.
    * Çoklu filtreleme yönetimi (hem metin hem de kategori kısıtlamasının aynı anda çalışması).

## 3. Sepete Ürün Ekleme Akışı

* **API Endpoint:** `POST /cart`
* **Görev:** Kullanıcının seçtiği ürünü sepete eklemesi.
* **UI Bileşenleri:**
    * "Sepete Ekle" butonu (Primary button style).
    * Navbar'da güncellenen Sepet ikonu ve sepet sayacı badge'i.
    * Stok aşımı durumunda uyarı mesajı (Alert/Toast).
* **Kullanıcı Deneyimi:**
    * Başarılı ekleme sonrası success notification ("Ürün sepetinize eklendi").
    * Kullanıcı giriş yapmamışsa işlemin reddedilmesi ve uyarı gösterilmesi.
    * Kullanıcı, mevcut stoktan fazlasını sepete eklemeye çalıştığında işlemi durduran hata yönetimi.
* **Teknik Detaylar:**
    * Sepet state yönetimi (Cart array manipülasyonu).
    * Giriş doğrulama (Authentication check - `localStorage` üzerinden active_user kontrolü).
    * Ürün ID'si üzerinden spesifik obje verisinin sepete kopyalanması.

## 4. Sipariş Oluşturma Akışı

* **API Endpoint:** `POST /orders`
* **Görev:** Kullanıcının sepetindeki ürünlerden sipariş oluşturması ve stokların düşürülmesi.
* **UI Bileşenleri:**
    * Sepet içeriğini listeleyen arayüz (ürün görseli, ismi ve fiyatı).
    * Toplam tutar göstergesi.
    * "Siparişi Onayla" butonu (Success/Primary button).
    * Sepetten ürün çıkarma (Sil) butonu.
* **Kullanıcı Deneyimi:**
    * Boş sepetle sipariş verilmesini engelleyen validation.
    * Sipariş tamamlandığında sepetin otomatik temizlenmesi ve ana sayfaya yönlendirme.
    * Kullanıcıya başarılı işlem mesajı verilmesi ("Siparişiniz başarıyla alındı").
* **Akış Adımları:**
    1. Sepet ekranında "Siparişi Onayla" butonuna tıklama.
    2. Sepet doluluk kontrolü.
    3. Sipariş kaydının oluşturulması ve zaman damgası eklenmesi.
    4. İlgili ürünlerin ana stoklarının azaltılması.
    5. Sepetin boşaltılması ve kullanıcıya geri bildirim.
* **Teknik Detaylar:**
    * Array `reduce()` fonksiyonu ile toplam tutar hesaplaması.
    * Eşzamanlı veri yazma işlemi (Hem kullanıcı sipariş geçmişine hem de global sipariş havuzuna).
    * Benzersiz sipariş ID'si oluşturma (`Date.now()`).

## 5. Sipariş Listeleme Sayfası

* **API Endpoint:** `GET /orders`
* **Görev:** Geçmiş siparişlerin kullanıcı veya yönetici yetkisine göre listelenmesi.
* **UI Bileşenleri:**
    * Siparişlerin listelendiği kart tasarımları (Tarih, Toplam Tutar, Ürün İsimleri).
    * Sipariş durumunu gösteren renk kodlu etiketler (Hazırlanıyor, Kargoya Verildi vs.).
    * Kullanıcı ve Yönetici için dinamik olarak değişen sayfa başlıkları.
* **Kullanıcı Deneyimi:**
    * En yeni siparişin en üstte gösterilmesi (Reverse chronological order).
    * Siparişi olmayanlar için Empty State ("Henüz geçmiş siparişiniz bulunmamaktadır").
    * Yönetici ekranında siparişi veren müşterinin adının vurgulu şekilde gösterilmesi.
* **Teknik Detaylar:**
    * Role-based Access Control (Kullanıcı rolüne göre farklı veri kümelerinin - kişisel vs global - render edilmesi).
    * Array manipülasyonu (`reverse()` metodu).

## 6. Ürün Ekleme Akışı (Yönetici Özel)

* **API Endpoint:** `POST /products`
* **Görev:** Sisteme yeni ürün eklenmesi (Yalnızca yetkili yönetici).
* **UI Bileşenleri:**
    * Ürün Adı input alanı (text).
    * Fiyat input alanı (number).
    * Kategori seçimi (select/dropdown).
    * Stok miktarı alanı (number).
    * Ürün Fotoğraf URL alanı (text).
    * "Ürünü Vitrine Ekle" butonu.
* **Form Validasyonu:**
    * Gerekli alanların (Ad, Fiyat, Stok) boş bırakılamaz kontrolü.
    * Sayısal alanların geçerliliğinin kontrolü (NaN check).
* **Kullanıcı Deneyimi:**
    * İşlem sonrasında formun otomatik olarak temizlenmesi.
    * Yeni eklenen ürünün anında ürün listesinin en üstünde görünür olması (Optimistic UI update).
* **Teknik Detaylar:**
    * Yönetici yetki doğrulama (`currentRole === 'admin'`).
    * Yeni ürün objesi oluşturulup veritabanı array'inin başına eklenmesi (`unshift()`).

## 7. Ürün Silme Akışı (Yönetici Özel)

* **API Endpoint:** `DELETE /products/{productId}`
* **Görev:** Sistemde bulunan bir ürünün tamamen silinmesi.
* **UI Bileşenleri:**
    * Yönetici panelindeki her ürün satırında bulunan "Sil" butonu (Danger/Red button style).
    * Browser tabanlı onay diyaloğu (Confirmation alert).
* **Kullanıcı Deneyimi:**
    * Yanlışlıkla veri kaybını önlemek için "Emin misiniz?" çift onay mekanizması.
    * Silme işlemi sonrasında UI'ın sayfa yenilenmeden anında güncellenmesi.
* **Teknik Detaylar:**
    * Silinecek ürünün ID'sine göre filtrelenerek diziden çıkarılması (`filter()` metodu).
    * Güncel state'in kalıcı hafızaya (Storage) yazılması.

## 8. Sipariş Durumu Güncelleme (Yönetici Özel)

* **API Endpoint:** `PUT /orders/{orderId}`
* **Görev:** Oluşturulmuş bir siparişin durumunun değiştirilmesi.
* **UI Bileşenleri:**
    * Yönetici panelindeki sipariş kartlarında bulunan "Durum Güncelle" dropdown menüsü.
    * Menü seçenekleri (Sipariş Alındı, Hazırlanıyor, Kargoya Verildi, Teslim Edildi, İptal Edildi).
* **Kullanıcı Deneyimi:**
    * Yönetici durumu değiştirdiği anda müşterinin "Hesabım" panelindeki ilgili sipariş durumunun anında değişmesi.
    * İşlem sonrası başarılı bildirim uyarısı.
* **Teknik Detaylar:**
    * Referans tabanlı güncelleme (Seçilen siparişin ID'sinin bulunup hem Global havuzda hem de ilgili Kullanıcı verisinde güncellenmesi).
    * `findIndex()` metodu ile spesifik obje manipülasyonu.
