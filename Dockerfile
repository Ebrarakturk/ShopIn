FROM python:3.9-slim

WORKDIR /app

# Önce sadece gereksinimleri kopyalayalım (Hız kazandırır)
COPY requirements.txt .

# Kütüphaneleri yükleyelim
RUN pip install --no-cache-dir -r requirements.txt

# Şimdi tüm dosyaları (shopin_api klasörü dahil) kopyalayalım
COPY . .

# Uygulamanın yolu senin dediğin gibi klasör içindeyse böyle kalabilir
CMD ["python", "shopin_api/app.py"]