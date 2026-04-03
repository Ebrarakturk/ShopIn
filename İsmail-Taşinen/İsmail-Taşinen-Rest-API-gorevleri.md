# İsmail TAŞİNEN'in REST API Metotları

**API Test Videosu:** 

### 1. Ürün Listeleme

* **Endpoint:** `GET /products`
* **Response:** `200 OK` - Tüm ürünler başarıyla listelendi

---

### 2. Detay Görüntüleme

* **Endpoint:** `GET /products/{productId}`
* **Path Parameters:**
  * `productId` (string, required) - Detayları görüntülenecek ürünün ID'si
* **Response:** `200 OK` - Ürün detayları başarıyla getirildi

---

### 3. Kullanıcı Kayıt

* **Endpoint:** `POST /users/register`
* **Request Body:**
  ```json
  {
    "username": "kullaniciadi123",
    "email": "ornek@email.com",
    "password": "GuvenliSifre123"
  }
  ```
* **Response:** `201 Created` - Kullanıcı başarıyla kayıt edildi

---

### 4. Kullanıcı Giriş

* **Endpoint:** `POST /users/login`
* **Request Body:**
  ```json
  {
    "email": "ornek@email.com",
    "password": "GuvenliSifre123"
  }
  ```
* **Response:** `200 OK` - Kullanıcı girişi başarılı (Token oluşturuldu)

---

### 5. Sepet Listeleme

* **Endpoint:** `GET /cart/{userId}`
* **Path Parameters:**
  * `userId` (string, required) - Sepeti listelenecek kullanıcının ID'si
* **Response:** `200 OK` - Kullanıcının sepeti başarıyla listelendi

---

### 6. Sepetten Ürün Silme

* **Endpoint:** `DELETE /cart/{cartItemId}`
* **Path Parameters:**
  * `cartItemId` (string, required) - Sepetten çıkarılacak öğenin ID'si
* **Response:** `200 OK` - Ürün sepetten başarıyla çıkarıldı

---

### 7. Ürün Güncelleme

* **Endpoint:** `PUT /products/{id}`
* **Path Parameters:**
  * `id` (string, required) - Güncellenecek ürünün ID'si
* **Request Body:**
  ```json
  {
    "name": "Güncellenmiş Ürün Adı",
    "price": 599,
    "description": "Yeni ürün açıklaması"
  }
  ```
* **Response:** `200 OK` - Ürün bilgileri başarıyla güncellendi

---

### 8. Sipariş Listeleme

* **Endpoint:** `GET /orders`
* **Response:** `200 OK` - Tüm kullanıcı siparişleri başarıyla listelendi
  }
