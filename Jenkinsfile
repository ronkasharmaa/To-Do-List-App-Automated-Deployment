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
	// Create worker EC2
        dir('Terraform') {
          sh '''
            terraform init
            terraform apply -auto-approve -var="key_name=Jenkins"
            terraform output -raw public_ip > ../Ansible/ec2_ip.txt
          '''
        }
      }
    }

    stage('Generate Inventory') {
      steps {
        sh '''
          IP=$(cat Ansible/ec2_ip.txt)
          mkdir -p /var/lib/jenkins/.ssh
          ssh-keyscan -H $IP >> /var/lib/jenkins/.ssh/known_hosts
          sed "s/\\\${public_ip}/$IP/" Ansible/inventory.ini.tpl > Ansible/inventory.ini
        '''
      }
    }

    stage('Configure & Deploy (Ansible)') {
      steps {
        // SSH into worker EC2 and deploy app
        sshagent(credentials: ['ec2-ssh-key']) {
          dir('Ansible') {
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
