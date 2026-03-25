from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB Bağlantısı (Docker içi servis adı 'mongo' kullanıldı)
client = MongoClient("mongodb://mongo:27017")
db = client.shopin_db

@app.route('/')
def home():
    return jsonify({"status": "Basarili", "message": "ShopIn API Ismail tarafindan calistirildi!"})

# 1. Ürün Listeleme
@app.route('/products', methods=['GET'])
def list_products():
    products = list(db.products.find({}, {"_id": 0}))
    return jsonify(products), 200

# 2. Detay Görüntüleme
@app.route('/products/<product_id>', methods=['GET'])
def product_detail(product_id):
    product = db.products.find_one({"id": product_id}, {"_id": 0})
    return jsonify(product if product else {"error": "Urun bulunamadi"}), 200

# 3. Kullanıcı Kayıt
@app.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    db.users.insert_one(data)
    return jsonify({"message": "Kayit basarili"}), 201

# 4. Kullanıcı Giriş
@app.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.users.find_one({"email": data.get('email'), "password": data.get('password')}, {"_id": 0})
    return jsonify({"message": "Giris basarili", "user": user} if user else {"error": "Hatali giris"}), 200

# 5. Sepet Listeleme
@app.route('/cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    cart = list(db.cart.find({"userId": user_id}, {"_id": 0}))
    return jsonify(cart), 200

# 6. Sepetten Ürün Silme
@app.route('/cart/<cart_item_id>', methods=['DELETE'])
def delete_from_cart(cart_item_id):
    db.cart.delete_one({"cartItemId": cart_item_id})
    return jsonify({"message": "Urun sepetten silindi"}), 200

# 7. Ürün Güncelleme
@app.route('/products/<id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    db.products.update_one({"id": id}, {"$set": data})
    return jsonify({"message": "Urun guncellendi"}), 200

# 8. Sipariş Listeleme (Yönetici Paneli)
@app.route('/orders', methods=['GET'])
def list_orders():
    orders = list(db.orders.find({}, {"_id": 0}))
    return jsonify(orders), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)