# API Tasarımı

**OpenAPI Spesifikasyon Dosyası:** [ShopIn.yaml](ShopIn.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.


## OpenAPI Specification
```yaml
openapi: 3.0.3
info:
  title: ShopIn E-Ticaret API
  version: 1.0.0
  description: |
    ShopIn e-ticaret platformu için tasarlanmış RESTful API spesifikasyonu.
    
    ## Özellikler
    - **Kullanıcı Yönetimi**: Yeni kullanıcı kaydı ve mevcut kullanıcıların profil yönetimi.
    - **Ürün Katalog Yönetimi**: Stok takibi, kategori bazlı filtreleme ve detaylı ürün sorgulama.
    - **Sepet İşlemleri**: Kullanıcı bazlı sepet oluşturma ve ürün yönetimi.
    - **Sipariş Süreçleri**: Sepetteki ürünlerin siparişe dönüştürülmesi ve durum takibi.
    - **Güvenlik**: JWT tabanlı (Bearer Token) kimlik doğrulama mekanizması.
    
    Bu API, temel e-ticaret iş akışlarını standartlara uygun şekilde yönetmek için tasarlanmıştır.
  contact:
    name: Senin Adın Soyadın
    email: eposta@adresin.edu.tr
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/v1
    description: Yerel Geliştirme Sunucusu (Development)

tags:
  - name: auth
    description: Kayıt ve giriş işlemleri
  - name: products
    description: Ürün kataloğu ve detay işlemleri
  - name: cart
    description: Kullanıcı sepet yönetimi
  - name: orders
    description: Sipariş oluşturma ve takip işlemleri

security:
  - bearerAuth: []

paths:
  /auth/register:
    post:
      tags: [auth]
      summary: Yeni kullanıcı kaydı
      description: Sisteme yeni bir kullanıcı profili ekler.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'

  /auth/login:
    post:
      tags: [auth]
      summary: Kullanıcı girişi
      description: Email ve şifre ile JWT token üretir.
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'

  /products:
    get:
      tags: [products]
      summary: Ürün listele
      description: Tüm ürünleri kategorilere göre filtreleyerek listeler.
      parameters:
        - name: category
          in: query
          schema: { type: string }
      responses:
        '200':
          description: Ürünler listelendi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  /products/{productId}:
    get:
      tags: [products]
      summary: Ürün detayı getir
      description: Belirtilen ID'ye sahip ürünün tüm detaylarını döner.
      parameters:
        - name: productId
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Ürün detayı başarıyla getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          $ref: '#/components/responses/NotFound'

  /cart:
    get:
      tags: [cart]
      summary: Sepeti listele
      description: Mevcut sepet içeriğini ve toplam fiyatı listeler.
      responses:
        '200':
          description: Sepet verileri getirildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'

  /orders:
    post:
      tags: [orders]
      summary: Sipariş oluştur
      description: Sepetteki ürünlerle yeni bir sipariş kaydı açar.
      responses:
        '201':
          description: Sipariş oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        email: { type: string }
        role: { type: string, enum: [admin, user] }

    UserRegistration:
      type: object
      required: [email, password, firstName, lastName]
      properties:
        email: { type: string, format: email }
        password: { type: string, minLength: 8 }
        firstName: { type: string }
        lastName: { type: string }

    AuthToken:
      type: object
      properties:
        token: { type: string }
        expiresIn: { type: integer, example: 3600 }

    Product:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        price: { type: number }
        stock: { type: integer }

    Cart:
      type: object
      properties:
        id: { type: string }
        items:
          type: array
          items:
            type: object
            properties:
              productId: { type: string }
              quantity: { type: integer }
        totalAmount: { type: number }

    Order:
      type: object
      properties:
        id: { type: string }
        status: { type: string, enum: [pending, shipped, delivered] }
        totalAmount: { type: number }
        createdAt: { type: string, format: date-time }

    Error:
      type: object
      required: [code, message]
      properties:
        code: { type: string }
        message: { type: string }

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
