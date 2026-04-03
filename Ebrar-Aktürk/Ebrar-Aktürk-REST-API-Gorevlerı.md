# Ebrar Aktürk'ün REST API Metotları

**API Test Videosu:** 


## 1. Stok Listeleme
- **Endpoint:** `GET /products/stock`
- **Response:** `200 OK` - Stok verileri başarıyla getirildi

## 2. Ürün Filtreleme
- **Endpoint:** `GET /products`
- **Response:** `200 OK` - Ürünler başarıyla listelendi

## 3. Yeni Ürün Ekleme
- **Endpoint:** `POST /products`
- **Request Body:**
    ```json
    {
      "id": "101",
      "name": "Sweatshirt",
      "price": 450,
      "stock": 25
    }
    ```
- **Response:** `201 Created` - Ürün başarıyla eklendi

## 4. Ürün Bilgilerini Güncelleme
- **Endpoint:** `PUT /products/{id}`
- **Path Parameters:**
    - `id` (string, required) - Güncellenecek ürünün ID'si
- **Request Body:**
    ```json
    {
      "price": 499,
      "stock": 20
    }
    ```
- **Response:** `200 OK` - Güncelleme başarılı

## 5. Sepete Ürün Ekleme
- **Endpoint:** `POST /cart`
- **Request Body:**
    ```json
    {
      "productId": "101",
      "quantity": 2
    }
    ```
- **Response:** `201 Created` - Ürün sepete başarıyla eklendi

## 6. Sepetten Ürün Silme
- **Endpoint:** `DELETE /cart/{cart_item_id}`
- **Path Parameters:**
    - `cart_item_id` (string, required) - Sepetten çıkarılacak öğenin ID'si
- **Response:** `200 OK` - Ürün sepetten çıkarıldı

## 7. Sipariş Oluşturma
- **Endpoint:** `POST /orders`
- **Request Body:**
    ```json
    {
      "userId": "user_123",
      "cartItems": ["item_1", "item_2"],
      "totalPrice": 950
    }
    ```
- **Response:** `201 Created` - Siparişiniz başarıyla alındı

## 8. Sipariş Durumu Güncelleme
- **Endpoint:** `PUT /orders/{order_id}`
- **Path Parameters:**
    - `order_id` (string, required) - Durumu güncellenecek siparişin ID'si
- **Request Body:**
    ```json
    {
      "status": "Kargoya Verildi"
    }
    ```
- **Response:** `200 OK` - Sipariş durumu başarıyla güncellendi
