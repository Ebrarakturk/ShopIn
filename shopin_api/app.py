from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# 1. Veritabanı Bağlantısı (Docker servis adıyla: mongo)
client = MongoClient("mongodb://mongo:27017")
db = client.shopin_db

# --- API METOTLARI BAŞLANGICI ---

# Ana Sayfa Kontrol
@app.route('/')
def home():
    return jsonify({"message": "ShopIn API Çalışıyor!"})

# GEREKSİNİM 1: Stok Görüntüleme (GET /products/stock)
@app.route('/products/stock', methods=['GET'])
def get_stock():
    # Veritabanındaki tüm ürünleri bul, sadece isim ve stok miktarını getir
    products = list(db.products.find({}, {"_id": 0, "name": 1, "stock": 1}))
    return jsonify(products), 200

# GEREKSİNİM 2: Ürün Filtreleme (GET /products?category=...)
@app.route('/products', methods=['GET'])
def filter_products():
    category = request.args.get('category')
    query = {"category": category} if category else {}
    products = list(db.products.find(query, {"_id": 0}))
    return jsonify(products), 200

# GEREKSİNİM 3: Sepete Ürün Ekleme (POST /cart)
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    if not data or 'product_id' not in data:
        return jsonify({"error": "Ürün bilgisi eksik!"}), 400
    
    # Sepete ekleme işlemi
    db.cart.insert_one(data)
    return jsonify({"message": "Ürün sepete eklendi!", "data": data}), 201

# --- API METOTLARI BİTİŞİ ---

# KRİTİK KURAL: Sunucuyu başlatan bu kısım her zaman en sonda olmalı!
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)