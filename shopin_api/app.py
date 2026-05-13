from flask_cors import CORS
from flask import Flask, jsonify, request
from pymongo import MongoClient
import os
import redis
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# MongoDB Atlas Bağlantısı
client = MongoClient("mongodb+srv://ebrar_akturk:Ebrar2005.@cluster0.rqknkis.mongodb.net/?retryWrites=true&w=majority")
db = client['shopin_db']

# Redis Bağlantısı (Docker compose'daki servis adı 'redis' olduğu için host='redis' yapıyoruz)
cache = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

@app.route('/')
def home():
    return jsonify({"message": "ShopIn API calistirildi!", "status": "Basarili"}), 200

# 1. GEREKSİNİM: Stok Görüntüleme
@app.route('/products/stock', methods=['GET'])
def get_stock():
    stock_list = list(db.products.find({}, {"_id": 0, "title": 1, "stock": 1}))
    return jsonify(stock_list), 200

# 2. GEREKSİNİM: Ürün Filtreleme ve Listeleme (REDIS BURAYA EKLENDİ)
@app.route('/products', methods=['GET'])
def get_products():
    category_filter = request.args.get('filter')
    
    # Filtreye göre Redis key'i oluştur (Örn: urunler_Elektronik veya urunler_hepsi)
    cache_key = f"urunler_{category_filter}" if category_filter else "urunler_hepsi"
    
    try:
        # 1. Önce Redis'te (Cache) bu veri var mı diye bak
        cached_products = cache.get(cache_key)
        if cached_products:
            # Video kanıtı için terminale yazdırıyoruz
            print(f"⚡ Veri REDIS'ten (Cache) cok hizli geldi! (Key: {cache_key})", flush=True)
            # Mobil uygulamanın bozulmaması için veriyi bozmadan direkt yolluyoruz
            return jsonify(json.loads(cached_products)), 200
    except Exception as e:
        print("Redis okuma hatasi:", e, flush=True)

    # 2. Eğer Redis'te yoksa MongoDB'den çek
    query = {}
    if category_filter:
        query['category'] = category_filter 
        
    products = list(db.products.find(query, {"_id": 0}))
    
    try:
        # 3. Veritabanından çektiğin bu sonucu 60 saniye boyunca Redis'e kaydet
        cache.set(cache_key, json.dumps(products), ex=60)
        print(f"🐢 Veri MONGODB'den geldi ve Redis'e kaydedildi. (Key: {cache_key})", flush=True)
    except Exception as e:
        print("Redis yazma hatasi:", e, flush=True)

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

# 5. GEREKSİNİM: Sipariş Listeleme
@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(db.orders.find({}, {"_id": 0}))
    return jsonify(orders), 200

# 6. GEREKSİNİM: Yeni Ürün Ekleme (Admin)
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    db.products.insert_one(data)
    return jsonify({"message": "Urun basariyla eklendi!"}), 201

# 7. GEREKSİNİM: Ürün Silme (Admin)
@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    db.products.delete_one({"id": product_id})
    return jsonify({"message": "Urun kalici olarak silindi!"}), 200

# 8. GEREKSİNİM: Sipariş Durumu Güncelleme (Admin)
@app.route('/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    db.orders.update_one({"id": order_id}, {"$set": {"status": data.get('status')}})
    return jsonify({"message": "Siparis durumu basariyla guncellendi!"}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
