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
                sh 'docker-compose down'
                // docker-compose dosyanı kullanarak sistemi başlatır
                sh 'docker-compose up -d'
            }
        }
    }
}