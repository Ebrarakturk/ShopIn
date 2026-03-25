FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
# Uygulaman shopin_api klasörünün içinde olduğu için yolunu böyle veriyoruz:
CMD ["python", "shopin_api/app.py"]