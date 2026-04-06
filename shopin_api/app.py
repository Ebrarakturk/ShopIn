from flask_cors import CORS
from flask import Flask, jsonify, request
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB Atlas Bağlantısı (Güvenli bir şekilde aynen korundu)
client = MongoClient("mongodb+srv://ebrar_akturk:Ebrar2005.@cluster0.rqknkis.mongodb.net/?retryWrites=true&w=majority")
db = client['shopin_db']

@app.route('/')
def home():
    return jsonify({"message": "ShopIn API calistirildi!", "status": "Basarili"}), 200

# 1. GEREKSİNİM: Stok Görüntüleme
@app.route('/products/stock', methods=['GET'])
def get_stock():
    # Sadece stok ve başlık bilgilerini döner
    stock_list = list(db.products.find({}, {"_id": 0, "title": 1, "stock": 1}))
    return jsonify(stock_list), 200

# 2. GEREKSİNİM: Ürün Filtreleme ve Listeleme (500 Hatası Çözüldü)
@app.route('/products', methods=['GET'])
def get_products():
    # URL'den gelen ?filter=Elektronik kelimesini yakalar
    category_filter = request.args.get('filter')
    
    query = {}
    if category_filter:
        query['category'] = category_filter # Sadece o kategoriyi arar
        
    products = list(db.products.find(query, {"_id": 0}))
    return jsonify(products), 200

# 3. GEREKSİNİM: Sepete Ürün Ekleme
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json
    db.cart.insert_one(data)
    return jsonify({"message": "Urun sepete eklendi!"}), 201

# 4. GEREKSİNİM: Sipariş Oluşturma
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    db.orders.insert_one(data)
    # Sipariş sonrası sepeti boşaltmak
    db.cart.delete_many({}) 
    return jsonify({"message": "Siparisiniz alindi!"}), 201


# 5. GEREKSİNİM: Kullanıcı Sipariş Listeleme (Arkadaşının sepetiyle karışmaz)
@app.route('/my-orders-list', methods=['GET'])
def get_orders():
    orders = list(db.orders.find({}, {"_id": 0}))
    return jsonify(orders), 200

# 7. GEREKSİNİM: Admin Ürün Silme (Arkadaşının sepetten silmesiyle karışmaz)
@app.route('/admin-delete-product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    db.products.delete_one({"id": product_id})
    return jsonify({"message": "Urun veritabanindan kalici olarak silindi!"}), 200

# 6. GEREKSİNİM: Yeni Ürün Ekleme (Admin)
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    db.products.insert_one(data)
    return jsonify({"message": "Urun basariyla eklendi!"}), 201




# 8. GEREKSİNİM: Sipariş Durumu Güncelleme (Admin)
@app.route('/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    db.orders.update_one({"id": order_id}, {"$set": {"status": data.get('status')}})
    return jsonify({"message": "Siparis durumu basariyla guncellendi!"}), 200


if __name__ == "__main__":
    # Postman ile uyumlu olması için port 8000 yapıldı
    port = int(os.environ.get("PORT", 8000))
    # debug=True sayesinde bir daha hata alırsan terminalde sebebini açıkça yazacak
    app.run(host="0.0.0.0", port=port, debug=True)
