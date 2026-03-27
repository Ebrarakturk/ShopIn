from flask_cors import CORS
from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
import os


app = Flask(__name__)

CORS(app)

# MongoDB Atlas Bağlantısı
# Kendi Connection String'ini buraya yapıştır!
client = MongoClient("mongodb+srv://ebrar_akturk:Ebrar2005.@cluster0.rqknkis.mongodb.net/?retryWrites=true&w=majority")
db = client['shopin_db']

@app.route('/')
def home():
    return jsonify({"message": "ShopIn API Ismail tarafindan calistirildi!", "status": "Basarili"}), 200

# 1 & 2. GEREKSİNİM: Ürün Listeleme ve Stok
@app.route('/products', methods=['GET'])
def get_products():
    products = list(db.products.find({}, {"_id": 0}))
    return jsonify(products), 200

@app.route('/products/stock', methods=['GET'])
def get_stock():
    # Sadece isim ve stok miktarını döner
    stock_list = list(db.products.find({}, {"_id": 0, "name": 1, "stock": 1}))
    return jsonify(stock_list), 200

# 3. GEREKSİNİM: Yeni Ürün Ekleme (Admin)
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    db.products.insert_one(data)
    return jsonify({"message": "Urun basariyla eklendi!"}), 201

# 4. GEREKSİNİM: Ürün Güncelleme (Admin)
@app.route('/products/<id>', methods=['PUT'])
def update_product(id):
    data = request.json
    db.products.update_one({"id": id}, {"$set": data})
    return jsonify({"message": "Urun guncellendi!"}), 200

# 5. GEREKSİNİM: Sepete Ürün Ekleme
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json
    db.cart.insert_one(data)
    return jsonify({"message": "Urun sepete eklendi!"}), 201

# 6. GEREKSİNİM: Sepetten Ürün Silme
@app.route('/cart/<cart_item_id>', methods=['DELETE'])
def delete_from_cart(cart_item_id):
    db.cart.delete_one({"productId": cart_item_id})
    return jsonify({"message": "Urun sepetten silindi!"}), 200

# 7. GEREKSİNİM: Sipariş Oluşturma
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    db.orders.insert_one(data)
    # Sipariş sonrası sepeti boşaltmak profesyonelce olur
    db.cart.delete_many({}) 
    return jsonify({"message": "Siparisiniz alindi!"}), 201

# 8. GEREKSİNİM: Sipariş Durumu Güncelleme (Admin)
@app.route('/orders/<order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    db.orders.update_one({"orderId": order_id}, {"$set": {"status": data['status']}})
    return jsonify({"message": "Siparis durumu guncellendi!"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
