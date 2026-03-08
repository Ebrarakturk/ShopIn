# API Tasarımı

**OpenAPI Spesifikasyon Dosyası:** [ShopIn.yaml](ShopIn.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.


## OpenAPI Specification
```yaml
openapi: 3.0.3
info:
  title: ShopIn E-Ticaret Yönetim API'si
  version: 1.0.0
  description: >
    Bu API, ShopIn e-ticaret platformundaki ürünlerin, sepet işlemlerinin ve 
    sipariş süreçlerinin yönetilmesi için tasarlanmış bir RESTful servistir. 
    Temel CRUD işlemlerini destekler. Ürünler kategorilere göre filtrelenebilir, 
    sepet yönetilebilir ve sipariş takibi yapılabilir. API, JWT tabanlı 
    kimlik doğrulama (Bearer Token) ile korunmaktadır.
  contact:
    name: Ebrar Aktürk
    email: ebraraktrk@gmail.com

servers:
  - url: http://localhost:3000
    description: Yerel geliştirme sunucusu (Development)

tags:
  - name: Urunler
    description: Ürün listeleme, detay görüntüleme, stok takibi ve admin yönetim işlemleri
  - name: Kimlik Dogrulama
    description: Kullanıcı kayıt (register) ve giriş (login) işlemleri
  - name: Sepet
    description: Kullanıcının kendi sepetine ürün ekleme, sepeti görüntüleme ve sepetten ürün silme işlemleri
  - name: Siparisler
    description: Sepetteki ürünlerle sipariş oluşturma (ödeme), sipariş geçmişini listeleme ve durum güncelleme işlemleri

security:
  - BearerAuth: []

paths:
  /api/products:
    get:
      tags:
        - Urunler
      summary: Ürünleri Listele ve Filtrele
      description: Sistemdeki tüm ürünlerin listelenmesini sağlar. İsteğe bağlı olarak ürün adına veya kategoriye göre filtreleme yapılabilir ve sayfalama desteklenir.
      operationId: listProducts
      parameters:
        - name: filter
          in: query
          required: false
          description: Ürün adı veya kategoriye göre arama yapmak için kullanılacak metin
          schema:
            type: string
          example: "ayakkabı"
        - name: page
          in: query
          required: false
          description: Sayfa numarası (varsayılan 1)
          schema:
            type: integer
            minimum: 1
            default: 1
          example: 1
      responses:
        "200":
          description: Ürünler başarıyla listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
        "400":
          description: Geçersiz istek parametreleri
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      tags:
        - Urunler
      summary: Yeni Ürün Ekle (Admin)
      description: Sisteme yeni bir ürün ekler. Bu işlemi gerçekleştirmek için yöneticinin (admin) JWT token'ı gereklidir.
      operationId: createProduct
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        "201":
          description: Ürün başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        "400":
          description: Eksik veya geçersiz istek verisi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Yetkisiz erişim (Token eksik veya geçersiz)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "403":
          description: Bu işlem için yönetici (admin) yetkisine sahip değilsiniz
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/products/{productId}:
    parameters:
      - name: productId
        in: path
        required: true
        description: İşlem yapılacak ürünün benzersiz kimlik numarası
        schema:
          type: string
        example: "prd123"

    get:
      tags:
        - Urunler
      summary: Ürün Detay Getir
      description: Belirtilen kimlik numarasına sahip ürünün tüm detaylarını getirir.
      operationId: getProductById
      responses:
        "200":
          description: Ürün detayları başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        "404":
          description: Belirtilen ID'ye sahip ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      tags:
        - Urunler
      summary: Ürünü Güncelle (Admin)
      description: Var olan bir ürünün bilgilerini (fiyat, stok, isim vb.) günceller. Yalnızca yönetici yetkisi gerektirir.
      operationId: updateProduct
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        "200":
          description: Ürün başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        "400":
          description: Geçersiz güncelleme verisi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Yetkisiz erişim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Güncellenecek ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      tags:
        - Urunler
      summary: Ürünü Sil (Admin)
      description: Belirtilen ürünü sistemden kalıcı olarak siler. Yalnızca yönetici yetkisi gerektirir.
      operationId: deleteProduct
      responses:
        "204":
          description: Ürün başarıyla silindi (İçerik döndürülmez)
        "401":
          description: Yetkisiz erişim
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "403":
          description: Yönetici yetkisi gerekiyor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "404":
          description: Silinecek ürün bulunamadı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/products/stock:
    get:
      tags:
        - Urunler
      summary: Stok Bilgilerini Görüntüle
      description: Tüm ürünlerin mevcut stok miktarlarını özet bir liste halinde getirir.
      operationId: getProductStocks
      responses:
        "200":
          description: Stok verileri başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    productId:
                      type: string
                      description: Ürün kimlik numarası
                    name:
                      type: string
                      description: Ürün adı
                    stock:
                      type: integer
                      description: Güncel stok adedi

  /api/auth/register:
    post:
      tags:
        - Kimlik Dogrulama
      summary: Kullanıcı Kayıt
      description: Platforma yeni bir müşteri veya kullanıcı kaydı oluşturur.
      operationId: registerUser
      security: [] # Kayıt işlemi için token gerekmediğini belirtir
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserInput'
      responses:
        "201":
          description: Kullanıcı kaydı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        "400":
          description: Geçersiz kayıt verisi (Örn; email zaten kullanımda)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/auth/login:
    post:
      tags:
        - Kimlik Dogrulama
      summary: Kullanıcı Giriş
      description: Kayıtlı kullanıcının e-posta ve şifresi ile sisteme giriş yapmasını sağlar ve API isteklerinde kullanılacak JWT token'ı döndürür.
      operationId: loginUser
      security: [] # Giriş işlemi için token gerekmediğini belirtir
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  description: Kullanıcının kayıtlı e-posta adresi
                  example: "ahmet@ornek.com"
                password:
                  type: string
                  format: password
                  description: Kullanıcının şifresi
                  example: "gizlisifre123"
      responses:
        "200":
          description: Giriş başarılı, yetkilendirme token'ı döndürüldü
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    description: API isteklerinde Authorization başlığında kullanılacak JWT
        "401":
          description: E-posta veya şifre hatalı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/cart:
    get:
      tags:
        - Sepet
      summary: Sepeti Listele
      description: Giriş yapmış olan kullanıcının sepetindeki tüm ürünleri, adetleri ve toplam sepet tutarını getirir.
      operationId: getCart
      responses:
        "200":
          description: Kullanıcının sepetindeki ürünler başarıyla listelendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'
        "401":
          description: Kimlik doğrulama başarısız
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      tags:
        - Sepet
      summary: Sepete Ürün Ekle
      description: Kullanıcının sepetine yeni bir ürün ekler veya sepette zaten varsa miktarını artırır.
      operationId: addToCart
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - productId
                - quantity
              properties:
                productId:
                  type: string
                  description: Sepete eklenecek ürünün kimlik numarası
                  example: "prd123"
                quantity:
                  type: integer
                  description: Eklenecek adet
                  example: 1
      responses:
        "201":
          description: Ürün sepete başarıyla eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'
        "400":
          description: Geçersiz ürün veya miktar
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız

  /api/cart/{itemId}:
    delete:
      tags:
        - Sepet
      summary: Sepetten Ürün Sil
      description: Belirtilen ürünü kullanıcının sepetinden tamamen çıkarır.
      operationId: removeFromCart
      parameters:
        - name: itemId
          in: path
          required: true
          description: Sepetten çıkarılacak ürünün kimlik numarası
          schema:
            type: string
          example: "prd123"
      responses:
        "200":
          description: Ürün sepetten başarıyla kaldırıldı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'
        "401":
          description: Kimlik doğrulama başarısız
        "404":
          description: Sepette böyle bir ürün bulunamadı

  /api/orders:
    get:
      tags:
        - Siparisler
      summary: Sipariş Geçmişini Listele
      description: Giriş yapmış olan kullanıcının daha önce oluşturduğu tüm siparişlerin listesini getirir.
      operationId: getUserOrders
      responses:
        "200":
          description: Kullanıcının tüm siparişleri başarıyla getirildi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Order'
        "401":
          description: Kimlik doğrulama başarısız

    post:
      tags:
        - Siparisler
      summary: Sipariş Oluştur (Ödeme Yap)
      description: Kullanıcının mevcut sepetindeki ürünleri kullanarak yeni bir sipariş oluşturur. Bu işlem sepeti temizler.
      operationId: createOrder
      responses:
        "201":
          description: Sipariş başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        "400":
          description: Sepet boş veya stok yetersiz
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        "401":
          description: Kimlik doğrulama başarısız

  /api/orders/{orderId}:
    put:
      tags:
        - Siparisler
      summary: Sipariş Durumu Güncelle (Admin)
      description: Belirli bir siparişin kargo/hazırlık durumunu günceller. Yalnızca yönetici yetkisi gerektirir.
      operationId: updateOrderStatus
      parameters:
        - name: orderId
          in: path
          required: true
          description: Durumu güncellenecek siparişin benzersiz kimlik numarası
          schema:
            type: string
          example: "ord456"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - status
              properties:
                status:
                  type: string
                  description: Siparişin yeni durumu
                  enum: [Hazırlanıyor, Kargoya Verildi, Teslim Edildi, İptal Edildi]
                  example: "Kargoya Verildi"
      responses:
        "200":
          description: Sipariş durumu başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        "400":
          description: Geçersiz sipariş durumu değeri
        "401":
          description: Yetkisiz erişim
        "403":
          description: Bu işlem için yönetici yetkisi gerekiyor
        "404":
          description: Sipariş bulunamadı

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: 'JWT tabanlı kimlik doğrulama. İstek başlığına "Authorization: Bearer <token>" eklenmeli.'

  schemas:
    User:
      type: object
      description: Sistemde kayıtlı olan kullanıcıyı temsil eden veri modeli
      properties:
        _id: 
          type: string
          description: Kullanıcının benzersiz sistem kimliği
          example: "usr123"
        name: 
          type: string
          description: Kullanıcının ad ve soyadı
          example: "Ahmet Yılmaz"
        email: 
          type: string
          description: Kullanıcının iletişim ve giriş için kullandığı e-posta adresi
          example: "ahmet@ornek.com"
        role: 
          type: string
          description: Kullanıcının sistemdeki yetki seviyesi
          enum: [user, admin]
          example: "user"
        createdAt: 
          type: string
          format: date-time
          description: Kullanıcının platforma kayıt olduğu tarih ve saat

    UserInput:
      type: object
      description: Yeni bir kullanıcı kaydı oluşturulurken beklenen veri modeli
      required: [name, email, password]
      properties:
        name: 
          type: string
          description: Kullanıcının ad ve soyadı
          example: "Ahmet Yılmaz"
        email: 
          type: string
          format: email
          description: Geçerli bir e-posta adresi formatı
          example: "ahmet@ornek.com"
        password: 
          type: string
          format: password
          minLength: 6
          description: Kullanıcının hesabını korumak için belirlediği şifre (en az 6 karakter)

    Product:
      type: object
      description: Sistemde satışı yapılan ürünü temsil eden veri modeli
      properties:
        _id: 
          type: string
          description: Ürünün benzersiz sistem kimliği
          example: "prd123"
        name: 
          type: string
          description: Ürünün adı ve başlığı
          example: "Spor Ayakkabı"
        price: 
          type: number
          description: Ürünün güncel satış fiyatı
          example: 1250.50
        category: 
          type: string
          description: Ürünün listelendiği kategori
          example: "Giyim"
        stock: 
          type: integer
          description: Ürünün depodaki mevcut adet bilgisi
          example: 50
        description: 
          type: string
          description: Ürün hakkında detaylı açıklama
          example: "Hafif ve rahat koşu ayakkabısı"
      required: [name, price, category]

    ProductInput:
      type: object
      description: Ürün ekleme veya güncelleme işlemlerinde beklenen veri modeli
      properties:
        name: 
          type: string
          minLength: 2
          description: Ürünün adı (En az 2 karakter olmalıdır)
          example: "Spor Ayakkabı"
        price: 
          type: number
          minimum: 0
          description: Ürünün satış fiyatı (Negatif olamaz)
          example: 1250.50
        category: 
          type: string
          description: Ürünün ait olduğu kategori
          example: "Giyim"
        stock: 
          type: integer
          description: Başlangıç stok adedi
          example: 100
      required: [name, price, category]

    Cart:
      type: object
      description: Kullanıcının sepetini ve içindeki ürünleri temsil eden veri modeli
      properties:
        _id: 
          type: string
          description: Sepetin benzersiz kimliği
          example: "crt789"
        userId: 
          type: string
          description: Sepetin ait olduğu kullanıcının kimliği
          example: "usr123"
        items:
          type: array
          description: Sepetteki ürünlerin listesi
          items:
            type: object
            properties:
              productId: 
                $ref: '#/components/schemas/Product'
                description: Sepete eklenen ürünün detayları
              quantity: 
                type: integer
                description: Bu üründen sepette kaç adet olduğu
                example: 2
        totalPrice: 
          type: number
          description: Sepetteki ürünlerin fiyat ve adet bazlı toplam tutarı
          example: 2501.00

    Order:
      type: object
      description: Oluşturulan siparişleri temsil eden veri modeli
      properties:
        _id: 
          type: string
          description: Siparişin benzersiz kimliği (Sipariş Numarası)
          example: "ord456"
        userId: 
          type: string
          description: Siparişi veren kullanıcının kimliği
        items:
          type: array
          description: Siparişte yer alan ürünlerin o anki dondurulmuş listesi
          items:
            type: object
            properties:
              name: 
                type: string
                description: Sipariş anındaki ürün adı
              price: 
                type: number
                description: Sipariş anındaki ürün fiyatı
              quantity: 
                type: integer
                description: Sipariş edilen adet
        totalAmount: 
          type: number
          description: Siparişin ödendiği toplam tutar
          example: 2501.00
        status: 
          type: string
          description: Siparişin mevcut durumu
          example: "Hazırlanıyor"
        address: 
          type: string
          description: Siparişin teslim edileceği adres
          example: "Kadıköy, İstanbul"
        createdAt: 
          type: string
          format: date-time
          description: Siparişin oluşturulduğu tarih ve saat

    Error:
      type: object
      description: API tarafında oluşan hata durumlarında döndürülen standart hata modeli
      properties:
        message:
          type: string
          description: Hatayı açıklayan ve kullanıcıya/geliştiriciye bilgi veren mesaj
          example: "İlgili kaynak bulunamadı veya yetkiniz yok."
