from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB Bağlantısı
client = MongoClient("mongodb+srv://ebrar_akturk:<db_password>@cluster0.rqknkis.mongodb.net/?appName=Cluster0")
db = client.shopin_db

@app.route('/')
def home():
    return jsonify({"message": "ShopIn API'sine Hoş Geldiniz!"}), 200

# 1. GEREKSİNİM: Stok Listeleme
@app.route('/products/stock', methods=['GET'])
def get_products_stock():
    products = list(db.products.find({}, {"_id": 1, "name": 1, "stock": 1}))
    for p in products:
        p['_id'] = str(p['_id'])
    return jsonify(products), 200

# 2. GEREKSİNİM: Ürün Filtreleme
@app.route('/products', methods=['GET'])
def filter_products():
    category = request.args.get('category')
    query = {"category": category} if category else {}
    products = list(db.products.find(query))
    for p in products:
        p['_id'] = str(p['_id'])
    return jsonify(products), 200

# 3. GEREKSİNİM: Sepete Ürün Ekleme
@app.route('/cart', methods=['POST'])
def add_product_to_cart():
    data = request.get_json()
    return jsonify({"message": "Ürün sepete eklendi!", "cart_data": data}), 201

# 4. GEREKSİNİM: Sipariş Verme
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    product_name = data.get('name')
    quantity = data.get('quantity', 1)
    product = db.products.find_one({"name": product_name})
    if product and product['stock'] >= quantity:
        db.products.update_one({"name": product_name}, {"$inc": {"stock": -quantity}})
        db.orders.insert_one({"product": product_name, "quantity": quantity, "status": "Hazırlanıyor"})
        return jsonify({"message": "Sipariş oluşturuldu!"}), 201
    return jsonify({"error": "Stok yetersiz!"}), 400

# 5. GEREKSİNİM: Sipariş Geçmişi
@app.route('/orders', methods=['GET'])
def list_orders():
    orders = list(db.orders.find())
    for o in orders:
        o['_id'] = str(o['_id'])
    return jsonify(orders), 200

# 6. GEREKSİNİM: Yeni Ürün Ekleme (Admin)
@app.route('/products', methods=['POST'])
def admin_add_product():
    data = request.get_json()
    db.products.insert_one(data)
    return jsonify({"message": "Yeni ürün eklendi!"}), 201

# 7. GEREKSİNİM: Ürün Silme (Admin)
@app.route('/products/<string:product_id>', methods=['DELETE'])
def admin_delete_product(product_id):
    result = db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Ürün silindi!"}), 200
    return jsonify({"error": "Bulunamadı!"}), 404

# 8. GEREKSİNİM: Sipariş Durumu Güncelleme (Admin)
@app.route('/orders/<string:order_id>', methods=['PUT'])
def admin_update_order(order_id):
    data = request.get_json()
    new_status = data.get('status')
    result = db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": new_status}})
    if result.modified_count > 0:
        return jsonify({"message": "Durum güncellendi!"}), 200
    return jsonify({"error": "Bulunamadı!"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)