pipeline {
  agent any

  environment {
    PGHOST = credentials('PGHOST')
    PGDATABASE = credentials('PGDATABASE')
    PGUSER = credentials('PGUSER')
    PORT = credentials('PORT')
    PGPASSWORD = credentials('PGPASSWORD')
  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        sh 'docker build -t todo-app:latest .'
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker-compose up
        '''
      }
    }
  }
}
