from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import redis
import pika
import json

app = Flask(__name__)
CORS(app) # Mobil uygulamanın backend'e sorunsuz bağlanması için

# --- 1. BAĞLANTILAR (Docker & Jenkins Uyumlu) ---
client = MongoClient("mongodb://mongo:27017/")
db = client.shopin_db

# Redis Bağlantısı (Cache için)
cache = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

# RabbitMQ Bağlantısı (Siparişleri kuyruğa fırlatmak için)
def send_order_to_queue(order_data):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
        channel = connection.channel()
        channel.queue_declare(queue='shopin_orders')
        channel.basic_publish(
            exchange='',
            routing_key='shopin_orders',
            body=json.dumps(order_data)
        )
        connection.close()
        return True
    except Exception as e:
        print(f"RabbitMQ Hatasi: {e}")
        return False

# --- 2. TEMEL ROTARLAR & KULLANICI İŞLEMLERİ ---

@app.route('/')
def home():
    return jsonify({"status": "Basarili", "message": "ShopIn API Ismail tarafindan calistirildi! Redis ve RabbitMQ Aktif!"})

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

# [Ürün Listeleme & Filtreleme] Çakışma önlendi, tek rotada birleştirildi.
@app.route('/products', methods=['GET'])
def list_and_filter_products():
    category = request.args.get('category')
    
    # Filtre yoksa önce Redis Cache'e bak (Işık hızında yanıt)
    if not category:
        cached_products = cache.get("shopin_products_all")
        if cached_products:
            return jsonify(json.loads(cached_products)), 200

    # Cache'de yoksa veya kategori filtresi varsa MongoDB'den çek
    query = {"category": category} if category else {}
    products = list(db.products.find(query))
    
    for p in products:
        if '_id' in p:
            p['_id'] = str(p['_id'])

    # Genel listeyse bir dahaki sefere hızlı gelsin diye Redis'e at (5 dakika)
    if not category:
        cache.setex("shopin_products_all", 300, json.dumps(products))

    return jsonify(products), 200

@app.route('/products/<product_id>', methods=['GET'])
def product_detail(product_id):
    product = db.products.find_one({"id": product_id}, {"_id": 0})
    return jsonify(product if product else {"error": "Urun bulunamadi"}), 200

# GEREKSİNM 1: Stok Listeleme
@app.route('/products/stock', methods=['GET'])
def get_products_stock():
    products = list(db.products.find({}, {"_id": 1, "name": 1, "stock": 1}))
    for p in products:
        p['_id'] = str(p['_id'])
    return jsonify(products), 200

# --- 4. SEPET İŞLEMLERİ ---

# GEREKSİNİM 3: Sepete Ürün Ekleme
@app.route('/cart', methods=['POST'])
def add_product_to_cart():
    data = request.get_json()
    db.cart.insert_one(data)
    return jsonify({"message": "Ürün sepete eklendi!", "cart_data": data}), 201

@app.route('/cart/<user_id>', methods=['GET'])
def get_cart(user_id):
    cart = list(db.cart.find({"userId": user_id}, {"_id": 0}))
    return jsonify(cart), 200

@app.route('/cart/<cart_item_id>', methods=['DELETE'])
def delete_from_cart(cart_item_id):
    db.cart.delete_one({"cartItemId": cart_item_id})
    return jsonify({"message": "Urun sepetten silindi"}), 200

# --- 5. SİPARİŞ İŞLEMLERİ (RABBITMQ ENTEGRELİ) ---

# GEREKSİNİM 4: Sipariş Verme (Stok Kontrolü + RabbitMQ Kuyruğu)
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    product_name = data.get('name')
    quantity = data.get('quantity', 1)
    
    product = db.products.find_one({"name": product_name})
    if product and product.get('stock', 0) >= quantity:
        # Stoğu güvenli şekilde düşür
        db.products.update_one({"name": product_name}, {"$inc": {"stock": -quantity}})
        
        # Siparişi oluştur ve RabbitMQ kuyruğuna gönder kanka
        order_payload = {"product": product_name, "quantity": quantity, "status": "Hazırlanıyor"}
        db.orders.insert_one(order_payload)
        
        if '_id' in order_payload:
            order_payload['_id'] = str(order_payload['_id'])
            
        send_order_to_queue(order_payload)
        
        # Stok değiştiği için Redis cache'ini sıfırla
        cache.delete("shopin_products_all")
        
        return jsonify({"message": "Sipariş oluşturuldu ve RabbitMQ kuyruğuna eklendi!"}), 201
    return jsonify({"error": "Stok yetersiz!"}), 400

# GEREKSİNİM 5: Sipariş Geçmişi / Listeleme
@app.route('/orders', methods=['GET'])
def list_orders():
    orders = list(db.orders.find())
    for o in orders:
        o['_id'] = str(o['_id'])
    return jsonify(orders), 200

# --- 6. ADMIN (YÖNETİCİ) METOTLARI ---

# GEREKSİNİM 6: Yeni Ürün Ekleme (Admin)
@app.route('/products', methods=['POST'])
def admin_add_product():
    data = request.get_json()
    db.products.insert_one(data)
    cache.delete("shopin_products_all") # Güncel liste gelsin diye cache temizliği
    return jsonify({"message": "Yeni ürün eklendi!"}), 201

@app.route('/products/<id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    db.products.update_one({"id": id}, {"$set": data})
    cache.delete("shopin_products_all")
    return jsonify({"message": "Urun guncellendi"}), 200

# GEREKSİNİM 7: Ürün Silme (Admin)
@app.route('/products/<string:product_id>', methods=['DELETE'])
def admin_delete_product(product_id):
    result = db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count > 0:
        cache.delete("shopin_products_all")
        return jsonify({"message": "Ürün silindi!"}), 200
    return jsonify({"error": "Bulunamadı!"}), 404

# GEREKSİNİM 8: Sipariş Durumu Güncelleme (Admin)
@app.route('/orders/<string:order_id>', methods=['PUT'])
def admin_update_order(order_id):
    data = request.get_json()
    new_status = data.get('status')
    result = db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": new_status}})
    if result.modified_count > 0:
        return jsonify({"message": "Durum güncellendi!"}), 200
    return jsonify({"error": "Bulunamadı!"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)