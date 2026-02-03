pipeline {
  agent any

  environment {
    // Jenkins Secret Text credential
    PGPASSWORD = credentials('PGPASSWORD')
  }

  stages {

    stage('Checkout') {
      steps {
        // Pull repo to Jenkins workspace
        checkout scm
      }
    }

    stage('Provision EC2 (Terraform)') {
      steps {
        sh 'mkdir -p ansible'
	// Create worker EC2
        dir('Terraform') {
          sh '''
	    ls -la
            terraform init
            terraform apply -auto-approve -var="key_name=Jenkins"
            terraform output -raw public_ip > ../ansible/ec2_ip.txt
          '''
        }
      }
    }

    stage('Generate Inventory') {
      steps {
        sh '''
          IP=$(cat ansible/ec2_ip.txt)
          sh 'ssh-keyscan -H $(cat ansible/ec2_ip.txt) >> ~/.ssh/known_hosts'
          sed "s/\\\${public_ip}/$IP/" ansible/inventory.ini.tpl > ansible/inventory.ini
        '''
      }
    }

    stage('Configure & Deploy (Ansible)') {
      steps {
        // SSH into worker EC2 and deploy app
        sshagent(credentials: ['ec2-ssh-key']) {
          dir('ansible') {
            sh '''
              ansible-playbook -i inventory.ini playbook.yml \
              --extra-vars "pgpassword=$PGPASSWORD"
            '''
          }
        }
      }
    }
  }
}
