# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [ShopIn](https://shop-in-taupe.vercel.app/)

## Grup Üyelerinin Web Frontend Görevleri

1. [Ebrar Aktürk'ün Web Frontend Görevleri](Ebrar-Aktürk/Ebrar-Aktürk-Web-Frontend-Görevleri.md)

2. [İsmail Taşinen'in Web Frontend Görevleri](İsmail-Taşinen/İsmail-Taşinen-Web-Frontend-Gorevleri.md)


---
# ShopIn - Frontend Mimarisı ve Teknolojileri

Bu projede herhangi bir harici kütüphane veya framework (React, Vue vb.) kullanılmadan, tamamen "Vanilla JS" (Saf JavaScript) ile modern bir Single Page Application (SPA) geliştirilmiştir.

## 1. Mimari ve Tasarım Yaklaşımı
* **Single Page Application (SPA):** Sayfa yenilenmeden, JavaScript DOM manipülasyonu ile ekranlar arası (Giriş, Mağaza, Sepet, Admin) akıcı geçişler sağlandı.
* **Tasarım Sistemi:** Harici bir CSS framework'ü (Bootstrap/Tailwind) kullanılmadan **Custom CSS** yazıldı. Flexbox mimarisiyle esnek (flexible) layoutlar oluşturuldu. Premium, minimalist siyah-beyaz bir tema ve CSS transition'ları uygulandı.

## 2. State Management (Durum Yönetimi)
* **Yerel Veritabanı (Local Database):** Gerçek bir backend sunucusu yerine tarayıcının `localStorage` API'si kullanılarak veritabanı simülasyonu yapıldı.
* **Veri Tutarlılığı:** Kullanıcı hesapları (`shopin_db`), favoriler (`favs_`), kişisel sipariş geçmişi (`orders_`) ve global sipariş havuzu (`shopin_all_orders`) JSON formatında stringify/parse edilerek yönetildi.
* **Local State:** Sepet (cart) verileri global JavaScript değişkenleri ile anlık olarak tutuldu ve yönetildi.

## 3. Güvenlik ve Yetkilendirme (Auth)
* **Role-based Access Control (RBAC):** Sisteme "Kullanıcı" ve "Yönetici" olmak üzere iki farklı rol eklendi.
* **Protected Routes (Korunan Ekranlar):** Yönetici paneline ve işlem fonksiyonlarına (ürün ekleme, silme, sipariş durumu güncelleme) sadece yetkili `admin` hesabı ile erişilmesi sağlandı.
* **Mükerrer Kayıt Kontrolü:** Aynı kullanıcı adıyla ikinci bir kayıt oluşturulması JavaScript validasyonları ile engellendi.

## 4. API ve Veri Entegrasyonu Simülasyonu
Projede dış bir API yerine, CRUD (Create, Read, Update, Delete) işlemleri `localStorage` üzerinde simüle edilmiştir:
* **GET:** Ürünleri, favorileri ve geçmiş siparişleri listeleme.
* **POST:** Yeni kullanıcı kaydı oluşturma, sepete ürün ekleme, sipariş onaylama, admin panelinden yeni ürün ekleme.
* **PUT:** Admin tarafından stok güncelleme ve sipariş durumu (Hazırlanıyor, Kargoya Verildi vb.) değiştirme.
* **DELETE:** Admin panelinden vitrindeki ürünü kalıcı olarak silme.

## 5. Performans ve Kullanıcı Deneyimi (UX)
* **Lightweight (Hafif Yapı):** Dış kütüphane bağımlılığı olmadığı için proje anında yüklenir ve çalışır (Zero dependency).
* **Real-time Validation:** Arama çubuğunda `onkeyup` event'i ile anında ürün filtreleme (Kategori ve isim bazlı).
* **Feedback (Geri Bildirim):** Başarılı işlemler, hatalar ve stok yetersizliği durumlarında tarayıcı alert'leri ve UI güncellemeleri ile kullanıcıya anında bilgi verilmesi.
* **Dinamik UI:** Stok bitince sepete ekle butonunun inaktif (disabled) olması.

## 6. Deployment (Yayınlama)
* Proje kaynak kodları **GitHub** üzerinde versiyonlanmış ve sürekli entegrasyon amacıyla **Vercel** üzerinden canlıya (hosting) alınmıştır.
