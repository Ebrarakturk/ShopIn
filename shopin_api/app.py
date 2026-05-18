import os
import json
import redis
import pika
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 1. BAĞLANTILAR (Docker & Jenkins Uyumlu) ---
# Atlas yerine CI/CD hattımız için Docker'daki mongo servisini kullanıyoruz
client = MongoClient("mongodb://mongo:27017/")
db = client['shopin_db']

# Redis Bağlantısı (Cache için)
cache = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

# RabbitMQ Bağlantısı (Siparişleri kuyruğa fırlatmak için)
def send_order_to_queue(order_data):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq', port=5672))
        channel = connection.channel()
        channel.queue_declare(queue='shopin_orders')
        channel.basic_publish(
            exchange='',
            routing_key='shopin_orders',
            body=json.dumps(order_data)
        )
        print("🐰 [RabbitMQ] Siparis mesaji basariyla kuyruga gonderildi!", flush=True)
        connection.close()
        return True
    except Exception as e:
        print(f"RabbitMQ Hatasi: {e}", flush=True)
        return False

# --- 2. TEMEL ROTALAR & KULLANICI İŞLEMLERİ ---

@app.route('/')
def home():
    return jsonify({"status": "Basarili", "message": "ShopIn API calistirildi! Redis ve RabbitMQ Aktif!"}), 200

@app.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    db.users.insert_one(data)
    return jsonify({"message": "Kayit basarili"}), 201

@app.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    user = db.users.find_one({"email": data.get('email'), "password": data.get('password')}, {"_id": 0})
    return jsonify({"message": "Giris basarili", "user": user} if user else {"error": "Hatali giris"}), 200

# --- 3. ÜRÜN METOTLARI (REDIS CACHE DESTEKLİ) ---

@app.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category') or request.args.get('filter')
    cache_key = f"urunler_{category}" if category else "shopin_products_all"
    
    # Filtre yoksa önce Redis Cache'e bak (Işık hızında yanıt)
    try:
        cached_products = cache.get(cache_key)
        if cached_products:
            print(f"⚡ Veri REDIS'ten (Cache) cok hizli geldi! (Key: {cache_key})", flush=True)
            return jsonify(json.loads(cached_products)), 200
    except Exception as e:
        print("Redis okuma hatasi:", e, flush=True)

    # Cache'de yoksa veya kategori filtresi varsa MongoDB'den çek
    query = {"category": category} if category else {}
    products = list(db.products.find(query))
    
    for p in products:
        if '_id' in p:
            p['_id'] = str(p['_id'])

    # Genel listeyse bir dahaki sefere hızlı gelsin diye Redis'e at
    try:
        cache.set(cache_key, json.dumps(products), ex=300)
        print(f"🐢 Veri MONGODB'den geldi ve Redis'e kaydedildi. (Key: {cache_key})", flush=True)
    except Exception as e:
        print("Redis yazma hatasi:", e, flush=True)

    return jsonify(products), 200

@app.route('/products/<product_id>', methods=['GET'])
def product_detail(product_id):
    product = db.products.find_one({"id": product_id}, {"_id": 0})
    return jsonify(product if product else {"error": "Urun bulunamadi"}), 200

@app.route('/products/stock', methods=['GET'])
def get_stock():
    stock_list = list(db.products.find({}, {"_id": 0, "title": 1, "stock": 1}))
    return jsonify(stock_list), 200

# --- 4. SEPET İŞLEMLERİ ---

@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    db.cart.insert_one(data)
    if '_id' in data:
        data['_id'] = str(data['_id'])
    return jsonify({"message": "Urun sepete eklendi!", "cart_data": data}), 201

@app.route('/cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    cart = list(db.cart.find({"userId": user_id}, {"_id": 0}))
    return jsonify(cart), 200

@app.route('/cart/<cart_item_id>', methods=['DELETE'])
def delete_from_cart(cart_item_id):
    db.cart.delete_one({"cartItemId": cart_item_id})
    return jsonify({"message": "Urun sepetten silindi"}), 200

# --- 5. SİPARİŞ İŞLEMLERİ (RABBITMQ ENTEGRELİ) ---

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    product_name = data.get('name')
    quantity = data.get('quantity', 1)
    
    product = db.products.find_one({"name": product_name})
    if product and product.get('stock', 0) >= quantity:
        # Stoğu güvenli şekilde düşür
        db.products.update_one({"name": product_name}, {"$inc": {"stock": -quantity}})
        
        # Siparişi oluştur ve RabbitMQ kuyruğuna gönder
        order_payload = data
        order_payload["status"] = "Hazırlanıyor"
        db.orders.insert_one(order_payload)
        
        if '_id' in order_payload:
            order_payload['_id'] = str(order_payload['_id'])
            
        send_order_to_queue(order_payload)
        
        # Sipariş sonrası sepeti boşaltmak
        db.cart.delete_many({}) 
        
        # Stok değiştiği için Redis cache'ini sıfırla
        cache.delete("shopin_products_all")
        
        return jsonify({"message": "Siparis olusturuldu ve RabbitMQ kuyruguna eklendi!"}), 201
    return jsonify({"error": "Stok yetersiz veya urun bulunamadi!"}), 400

@app.route('/orders', methods=['GET'])
def get_orders():
    orders = list(db.orders.find({}, {"_id": 0}))
    return jsonify(orders), 200

# --- 6. ADMIN (YÖNETİCİ) METOTLARI ---

@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    db.products.insert_one(data)
    cache.delete("shopin_products_all") # Güncel liste gelsin diye cache temizliği
    return jsonify({"message": "Yeni urun basariyla eklendi!"}), 201

@app.route('/products/<id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    db.products.update_one({"id": id}, {"$set": data})
    cache.delete("shopin_products_all")
    return jsonify({"message": "Urun guncellendi"}), 200

@app.route('/products/<string:product_id>', methods=['DELETE'])
def admin_delete_product(product_id):
    try:
        result = db.products.delete_one({"_id": ObjectId(product_id)})
    except:
        result = db.products.delete_one({"id": product_id})
        
    if result.deleted_count > 0:
        cache.delete("shopin_products_all")
        return jsonify({"message": "Urun silindi!"}), 200
    return jsonify({"error": "Bulunamadi!"}), 404

@app.route('/orders/<string:order_id>', methods=['PUT'])
def admin_update_order(order_id):
    data = request.get_json()
    new_status = data.get('status')
    try:
        result = db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": new_status}})
    except:
        result = db.orders.update_one({"id": order_id}, {"$set": {"status": new_status}})
        
    if result.modified_count > 0:
        return jsonify({"message": "Durum guncellendi!"}), 200
    return jsonify({"error": "Bulunamadi!"}), 404

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port, debug=True)