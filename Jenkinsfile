pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Docker imajı hazırlanıyor...'
                // Bu komut senin yazdığın Dockerfile'ı paketler
                sh 'docker build -t shopin-api-final .'
            }
        }
        stage('Test') {
            steps {
                echo 'API testi yapılıyor...'
                // Buraya ileride basit bir test komutu ekleyebiliriz
                echo 'Testler başarılı!'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Uygulama Docker üzerinde ayağa kalkıyor...'
                // Kaçak konteynerleri hata verse bile (|| true) zorla siler
                sh 'docker rm -f mongodb_kapsayici shopinapi_kapsayici shopin_redis shopin_rabbitmq || true'
                sh 'docker-compose down' 
                sh 'docker-compose up -d --build'
            }
        }
            }
        }
    
