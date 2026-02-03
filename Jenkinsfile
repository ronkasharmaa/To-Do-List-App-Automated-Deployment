pipeline {
	agent any

	environment {
		PGPASSWORD = credentials('PGPASSWORD')
	 }
	stages {

		stage('Checkout') {
			steps {
				checkout scm
			}
		}

		stage('Build & Run') {
			steps{
				sh 'docker compose -f Docker/docker-compose.yml up -d --build'
			}

		}
	}
}
